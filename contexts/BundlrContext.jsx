import { createContext, useState, useEffect, useContext } from "react";
import BundlrClient from "../lib/BundlrClient";
import BundlrFileSystem from "../lib/BundlrFileSystem";

const BundlrContext = createContext();

export function BundlrContextProvider({ children }) {
    const [currentFolder, setCurrentFolder] = useState('root');
    const [contextData, setContextData] = useState({});

    useEffect(() => {
        async function initialize() {
            const client = new BundlrClient();
            await client.initialize();

            const fileSystem = new BundlrFileSystem(client);
            await fileSystem.initialize()
            
            setContextData({
                client,
                fileSystem
            });
        }

        initialize();
    }, [])

    return (
        <BundlrContext.Provider value={{
            currentFolder,
            setCurrentFolder,
            ...contextData
        }}>
            {children}
        </BundlrContext.Provider>
    )
};

export const useBundlrContext = () => useContext(BundlrContext);