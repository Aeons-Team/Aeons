import { create } from "zustand";
import { shallow } from "zustand/shallow";
import BundlrClient from "../lib/BundlrClient";
import BundlrFileSystem from "../lib/BundlrFileSystem";

const client = new BundlrClient()
const fileSystem = new BundlrFileSystem(client)

export const useBundlrStore = create((set, get) => ({
    initialized: false, 
    client,
    fileSystem,
    loadedBalance: null,
    render: false,
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
        const { client, fileSystem, fetchLoadedBalance } = get()
        await client.initialize(provider);
		await fileSystem.initialize();
        
        set({ 
            initialized: true
        })

        fetchLoadedBalance();
    },

    rerender: () => {
        set(state => ({ render: !get().render }))
        get().fetchLoadedBalance()
    },
    
    uploadNext: async () => {
        const { fileSystem, rerender, uploadQueue } = get()
        const first = uploadQueue[0]

        set({ 
            uploading: true, 
            uploadQueue: uploadQueue.slice(1),
            bytesUploaded: 0,
            currentUpload: first.file
        })    

        const uploader = fileSystem.createFile(
            first.file, 
            {
                parent: first.parent
            }, 
            {
                chunkUpload: (info) => {
                    set({ bytesUploaded: info.totalUploaded })   
                },
                done: () => {
                    const queue = get().uploadQueue

                    if (queue.length == 0) {
                        set({ uploading: false })
                    }

                    else {
                        get().uploadNext()
                    }

                    rerender()
                }
            }
        )

        set({ currentUploader: uploader })
    },

    uploadFiles: async (files, parent) => {
        const { uploading, uploadNext } = get()
        const items = []

        for (const file of files) {
            items.push({  
                file,
                parent
            })
        }

        set({ uploadQueue: items })

        if (!uploading) {
            uploadNext()
        }
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

export const useBundlrState = (func) => useBundlrStore(func, shallow);