import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { ethers } from "ethers";
import fileReaderStream from "filereader-stream";
import { ChunkingUploader } from "@bundlr-network/client/build/common/chunkingUploader";
import BundlrClient from "../lib/BundlrClient";
import UserContract from "../lib/UserContract";
import ContractState from "../lib/ContractState";

interface UploadQueueItem {
    file: File,
    parentId: string
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
    bytesUploaded: number | null,
    fetchWalletBalance: Function,
    fetchLoadedBalance: Function,
    uploadNext: (name?: string) => Promise<void>,
    initialize: (provider: ethers.providers.Web3Provider) => Promise<void>,
    uploadFiles: (files: File[], parentId: string) => void,
    createFolder: (name: string, parentId: string) => Promise<void>,
    renameFile: (id: string, newName: string) => Promise<void>,
    relocateFiles: (ids: string[], oldParentId: string, newParentId: string) => Promise<void>,
    removeFromUploadQueue: (i: number) => void,
    pauseOrResume: Function
}

export const useDriveStore = create<DriveStoreData>((set, get) => ({
    initialized: false, 
    client: new BundlrClient(),
    contract: new UserContract(),
    contractState: null,
    walletBalance: null,
    loadedBalance: null,
    uploading: false,
    paused: false,
    uploadQueue: [],
    currentName: '',
    currentUploader: null,
    bytesUploaded: null,
    
    
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
        await client.initialize(provider);
        await contract.initialize(provider, client);

        contract.updateUIAction = () => set({ contractState: contract.state.copy() })
        
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

        const uploader = client.uploadChunked(
            fileReaderStream(first.file), 
            {
                tags: [
                    { name: 'Content-Type', value: first.file.type }
                ]
            }, 
            {
                chunkUpload: (info) => {
                    if (get().currentUploader == uploader) {
                        set({ bytesUploaded: info.totalUploaded })   
                    }
                },
                done: (result) => {
                    set({ uploading: false, uploadQueue: uploadQueue.slice(1), bytesUploaded: 0 })

                    fetchLoadedBalance()

                    contract.insert({
                        id: result.data.id,
                        contentType: first.file.type,
                        name: name || first.file.name,
                        parentId: first.parentId,
                        size: first.file.size,
                        createdAt: new Date().getTime()
                    })
                }
            }
        )

        set({ currentUploader: uploader })
    },

    uploadFiles: async (files: File[], parentId: string) => {
        const { uploadQueue } = get()

        for (const file of files) {
            uploadQueue.push({  
                file,
                parentId
            })
        }

        set({ uploadQueue: [...uploadQueue] })
    },

    createFolder: async (name: string, parentId: string) => {
        const { contract } = get()

        await contract.insert({
            name,
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
            set({ currentUploader: null })

            set({ uploading: false, uploadQueue: uploadQueue.slice(1), bytesUploaded: 0 })
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
    }
}));

export const useDriveState = (selector: (state: DriveStoreData) => DriveStoreData) => useDriveStore<DriveStoreData>(selector, shallow);