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
    }
}));

export const useBundlrState = (func) => useBundlrStore(func, shallow);