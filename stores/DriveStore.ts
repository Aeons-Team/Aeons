import { create } from "zustand";
import { shallow } from "zustand/shallow";
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
    uploading: boolean,
    paused: boolean,
    uploadQueue: UploadQueueItem[],
    currentUpload: File | null,
    currentUploader: ChunkingUploader | null
    bytesUploaded: number | null,
    fetchLoadedBalance: Function,
    uploadNext: Function,
    uploadFiles: (files: File[], parentId: string) => void,
    createFolder: (name: string, parentId: string) => Promise<void>,
    renameFile: (id: string, newName: string) => Promise<void>,
    relocateFiles: (ids: string[], oldParentId: string, newParentId: string) => Promise<void>,
    pauseOrResume: Function
}

export const useDriveStore = create<DriveStoreData>((set, get) => ({
    initialized: false, 
    client: new BundlrClient(),
    contract: new UserContract(),
    contractState: null,
    loadedBalance: null,
    uploading: false,
    paused: false,
    uploadQueue: [],
    currentUpload: null,
    currentUploader: null,
    bytesUploaded: null,
    
    fetchLoadedBalance: async () => {
        const loadedBalance = await get().client.getLoadedBalance();
        set({ loadedBalance })
    },

    initialize: async (provider) => {
        const { client, contract, fetchLoadedBalance } = get()
        await client.initialize(provider);
        await contract.initialize(provider, client);

        contract.updateUIAction = () => set({ contractState: contract.state.copy() })
        
        set({ 
            initialized: true,
            contractState: contract.state
        })

        fetchLoadedBalance();
    },
    
    uploadNext: async () => {
        const { client, contract, fetchLoadedBalance, uploadQueue } = get()
        const first = uploadQueue[0]

        set({ 
            uploading: true, 
            uploadQueue: uploadQueue.slice(1),
            bytesUploaded: 0,
            currentUpload: first.file
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
                    set({ bytesUploaded: info.totalUploaded })   
                },
                done: (result) => {
                    const queue = get().uploadQueue

                    if (queue.length == 0) {
                        set({ uploading: false })
                    }

                    else {
                        get().uploadNext()
                    }

                    fetchLoadedBalance()

                    contract.insert({
                        id: result.data.id,
                        contentType: first.file.type,
                        name: first.file.name,
                        parentId: first.parentId,
                        size: first.file.size
                    })
                }
            }
        )

        set({ currentUploader: uploader })
    },

    uploadFiles: async (files: File[], parentId: string) => {
        const { uploading, uploadQueue, uploadNext } = get()

        for (const file of files) {
            uploadQueue.push({  
                file,
                parentId
            })
        }

        set({ uploadQueue })

        if (!uploading) {
            uploadNext()
        }
    },

    createFolder: async (name: string, parentId: string) => {
        const { contract } = get()

        await contract.insert({
            name,
            parentId,
            contentType: "folder"
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