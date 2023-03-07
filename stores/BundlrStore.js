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
    currentFile: "root",
    currentFileData: null,
    currentFileAncestors: ["root"],
    fetchLoadedBalance: async () => {
        const client = get().client
        const loadedBalance = await client.getLoadedBalance();
        set({ loadedBalance })
    },
    initialize: async (provider) => {
        const { client, fileSystem, fetchLoadedBalance, currentFile } = get()
        await client.initialize(provider);
		await fileSystem.initialize();
        await fetchLoadedBalance();
        
        set({ 
            initialized: true,
            currentFileData: fileSystem.hierarchy.getFile(currentFile)
        })
    },
    setCurrentFile: (id) => {
        const { fileSystem } = get()

        set({
            currentFile: id,
            currentFileData: fileSystem.hierarchy.getFile(id),
            currentFileAncestors: fileSystem.hierarchy.getAncestors(id)
        })
    },
    refreshCurrentFileData: () => {
        const { currentFile } = get()
        
        set({ 
            currentFileData: { ...fileSystem.hierarchy.getFile(currentFile) }
        })
    }
}));

export const useBundlrState = (func) => useBundlrStore(func, shallow);