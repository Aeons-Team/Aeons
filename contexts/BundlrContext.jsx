import { createContext, useState, useEffect, useContext } from "react";
import BundlrClient from "../lib/BundlrClient";
import BundlrFileSystem from "../lib/BundlrFileSystem";

const BundlrContext = createContext();

export function BundlrContextProvider({ children }) {
    const [initialized, setInitialized] = useState(false);
    const [client, setClient] = useState(new BundlrClient());
    const [fileSystem, setFileSystem] = useState(new BundlrFileSystem(client));
    const [balance, setBalance] = useState();
    const [currentFolder, setCurrentFolder] = useState('root');

    async function fetchBalance() {
        const balance = await client.getBalance();
        setBalance(balance);
    }

    useEffect(() => {
        async function initialize() {
            await client.initialize();
            await fileSystem.initialize();
            await fetchBalance();
            setInitialized(true);
        }

        initialize();
    }, [])

    return (
        <BundlrContext.Provider value={{
            initialized,
            client,
            fileSystem,
            balance,
            fetchBalance,
            currentFolder,
            setCurrentFolder
        }}>
            {children}
        </BundlrContext.Provider>
    )
};

export const useBundlrContext = () => useContext(BundlrContext);