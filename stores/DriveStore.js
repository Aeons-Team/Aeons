import { create } from "zustand";
import { shallow } from "zustand/shallow";
import fileReaderStream from "filereader-stream";
import BundlrClient from "../lib/BundlrClient";
import UserContract from "../lib/UserContract";

export const useDriveStore = create((set, get) => ({
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
                        size: first.size
                    })
                    .then(() => set({ contractState: contract.state }))
                }
            }
        )

        set({ currentUploader: uploader })
    },

    uploadFiles: async (files, parentId) => {
        const { uploading, uploadNext } = get()
        const items = []

        for (const file of files) {
            items.push({  
                file,
                parentId
            })
        }

        set({ uploadQueue: items })

        if (!uploading) {
            uploadNext()
        }
    },

    createFolder: async (name, parentId) => {
        const { contract } = get()

        await contract.insert({
            name,
            parentId,
            contentType: "folder"
        })

        set({ contractState: contract.state })
    },

    renameFile: async (id, newName) => {
        const { contract } = get()
        await contract.rename(id, newName)

        set({ contractState: contract.state })
    },
    
    relocateFiles: async (ids, oldParentId, newParentId) => {
        const { contract } = get()
        await contract.relocate(ids, oldParentId, newParentId)

        set({ contractState: contract.state })
    },

    pauseOrResume: () => {
        const { currentUploader, paused } = get()

        if (paused) {
            currentUploader.resume()
        }

        else {
            currentUploader.pause()
        }

        set({ paused: !get().paused })
    }
}));

export const useDriveState = (func) => useDriveStore(func, shallow);