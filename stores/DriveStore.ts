import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { subscribeWithSelector } from "zustand/middleware"
import { ethers } from "ethers";
import { v4 as uuidv4 } from 'uuid';
import fileReaderStream from "filereader-stream";
import { ChunkingUploader } from "@bundlr-network/client/build/common/chunkingUploader";
import BundlrClient from "../lib/BundlrClient";
import UserContract from "../lib/UserContract";
import ContractState from "../lib/ContractState";
import Crypto from "../lib/Crypto";
import { encryptWithPublicKey } from 'eth-crypto'

interface UploadQueueItem {
    file: File,
    parentId: string,
    encrypted?: boolean
}

export interface PromptArgs {
    type: string,
    value?: string,
    resolve: Function,
    errorMessage?: string
}

interface DriveStoreData {
    initialized: boolean,
    client: BundlrClient,
    contract: UserContract,
    contractState: ContractState | null,
    loadedBalance: string | null,
    walletBalance: string | null,
    uploading: boolean,
    paused: boolean,
    uploadQueue: UploadQueueItem[],
    currentName: string,
    currentUploader: ChunkingUploader | null
    uploadSpeed: number,
    bytesUploaded: number | null,
    loadingText: string,
    fetchWalletBalance: Function,
    fetchLoadedBalance: Function,
    currentPrompt: PromptArgs | null,
    uploadNext: (name?: string) => Promise<void>,
    initialize: (provider: ethers.providers.Web3Provider) => Promise<void>,
    uploadFiles: (files: File[], parentId: string) => void,
    createFolder: (name: string, parentId: string) => Promise<void>,
    renameFile: (id: string, newName: string) => Promise<void>,
    relocateFiles: (ids: string[], oldParentId: string, newParentId: string) => Promise<void>,
    removeFromUploadQueue: (i: number) => void,
    pauseOrResume: Function,
    insufficentBalance: boolean,
    setInsufficientBalance: Function,
    prompt: (args: PromptArgs) => void,
    reinitialize: (provider: ethers.providers.Web3Provider) => Promise<void>
}

export const useDriveStore = create(
    subscribeWithSelector<DriveStoreData>((set, get) => ({
        initialized: false, 
        client: new BundlrClient(),
        contract: new UserContract(),
        contractState: null,
        walletBalance: null,
        loadedBalance: null,
        uploading: false,
        uploadSpeed: 0,
        paused: false,
        uploadQueue: [],
        currentName: '',
        currentUploader: null,
        bytesUploaded: null,
        loadingText: 'Initializing',
        insufficentBalance: false,
        currentPrompt: null,
        setInsufficientBalance: (value: boolean) => set({ insufficentBalance: value }),
        
        fetchWalletBalance: async () => {
            const walletBalance = await get().client.getWalletBalance();
            set({ walletBalance })
        },

        fetchLoadedBalance: async () => {
            const loadedBalance = await get().client.getLoadedBalance();
            set({ loadedBalance })
        },

        initialize: async (provider: ethers.providers.Web3Provider) => {
            const { client, contract, fetchWalletBalance, fetchLoadedBalance } = get()

            const log = (text) => set({ loadingText: text })

            await client.initialize(provider, log);
            await contract.initialize(provider, client, log, get().prompt);

            contract.updateUIAction = () => set({ contractState: contract.state.copy() })
            
            set({ 
                initialized: true,
                contractState: contract.state
            })

            fetchWalletBalance();
            fetchLoadedBalance();
        },

        reinitialize: async (provider: ethers.providers.Web3Provider) => {
            const { client, contract, fetchWalletBalance, fetchLoadedBalance } = get()

            set({ initialized: false })

            const log = (text) => set({ loadingText: text })

            await client.initialize(provider, log);

            set({ 
                initialized: true,
                contractState: contract.state
            })

            fetchWalletBalance();
            fetchLoadedBalance();
        },
        
        uploadNext: async (name?: string) => {
            const { client, contract, fetchLoadedBalance, uploadQueue } = get()
            const first = uploadQueue[0]

            set({ 
                uploading: true, 
                bytesUploaded: 0,
                currentName: name || first.file.name
            })    

            const startTimes: any = {}
            const initialTime = new Date().getTime() / 1000
            const sizes: number[] = []
            const durations: number[] = []
            
            let batchSize = Number(process.env.NEXT_PUBLIC_CHUNKED_UPLOADER_BATCH_SIZE)
            let nextChunk = batchSize + 1
            let index = 0

            let key = await Crypto.aesGenKey()
            let keyExported = await Crypto.aesExportKey(key)

            const encryption = await encryptWithPublicKey(contract.internalWallet.publicKey.substring(2), keyExported)

            let data = first.encrypted 
                ? await Crypto.aesEncryptFile(first.file, key, Buffer.from(encryption.iv, 'hex').buffer) 
                : fileReaderStream(first.file) 

            const uploader = client.uploadChunked(
                data, 
                {
                    tags: [
                        { name: 'Content-Type', value: first.file.type }
                    ]
                }, 
                {
                    chunkUpload: (info) => {
                        if (get().currentUploader != uploader) return

                        const partial: any = { bytesUploaded: info.totalUploaded }

                        if (info.id != 1) {                        
                            const now = new Date().getTime() / 1000
                            const duration = now - (startTimes[info.id] || initialTime) 
        
                            if (durations.length < batchSize) {
                                durations.push(duration)
                                sizes.push(info.size)
                            }
                            
                            else {
                                durations[index % batchSize] = duration
                                sizes[index++ % batchSize] = info.size
                            }
        
                            startTimes[++nextChunk] = now
                            partial.uploadSpeed = sizes.reduce((x, y) => x + y, 0) / durations.reduce((x, y) => Math.max(x, y), 0) 
                        }

                        set(partial)   
                    },
                    done: (result) => {
                        set({ uploading: false, uploadQueue: uploadQueue.slice(1), bytesUploaded: 0, uploadSpeed: 0 })

                        fetchLoadedBalance()

                        contract.insert({
                            id: result.data.id,
                            contentType: first.file.type,
                            name: name || first.file.name,
                            parentId: first.parentId,
                            size: first.file.size,
                            createdAt: new Date().getTime(),
                            encryption: first.encrypted ? (encryption.iv + encryption.mac + encryption.ephemPublicKey + encryption.ciphertext) : undefined
                        })
                    },
                    error: (error) => {
                        if(error.message == 'Not enough funds to send data') {
                            set({ insufficentBalance: true })
                        }
                    }
                }
            )

            set({ currentUploader: uploader })
        },

        uploadFiles: async (files: File[], parentId: string, encrypted: boolean = false) => {
            const { uploadQueue } = get()

            for (const file of files) {
                uploadQueue.push({  
                    file,
                    parentId,
                    encrypted
                })
            }

            set({ uploadQueue: [...uploadQueue] })
        },

        createFolder: async (name: string, parentId: string) => {
            const { contract } = get()

            await contract.insert({
                name,
                id: uuidv4(),
                parentId,
                contentType: "folder",
                createdAt: new Date().getTime()
            })
        },

        renameFile: async (id: string, newName: string) => {
            const { contract } = get()
            await contract.rename(id, newName)
        },
        
        relocateFiles: async (ids: string[], oldParentId: string, newParentId: string) => {
            const { contract } = get()
            await contract.relocate(ids, oldParentId, newParentId)
        },

        removeFromUploadQueue: (i: number) => {
            const { uploadQueue, currentUploader } = get()

            if (i == 0) {
                currentUploader?.pause()

                set({ currentUploader: null, uploading: false, uploadQueue: uploadQueue.slice(1), bytesUploaded: 0, paused : false })
            }

            else {
                uploadQueue.splice(i, 1)
                set({ uploadQueue: [...uploadQueue] })
            }
        },

        pauseOrResume: () => {
            const { currentUploader, paused } = get()

            if (paused) {
                currentUploader?.resume()
            }

            else {
                currentUploader?.pause()
            }

            set({ paused: !get().paused })
        },

        prompt: (args: PromptArgs) => {
            set({ currentPrompt: args })
        }
    })
));

export const useDriveState = (selector: (state: DriveStoreData) => DriveStoreData) => useDriveStore<DriveStoreData>(selector, shallow);