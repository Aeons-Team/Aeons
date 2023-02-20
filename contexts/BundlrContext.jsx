import { createContext, useState, useEffect, useContext } from "react";
import BundlrClient from "../lib/BundlrClient";

const BundlrContext = createContext();

export function BundlrContextProvider({ children }) {
    const [client, setClient] = useState();

    useEffect(() => {
        async function initialize() {
            const client = new BundlrClient()
            await client.initialize()

            setClient(client)
        } 

        initialize()
    }, [])

    return (
        <BundlrContext.Provider value={client}>
            {children}
        </BundlrContext.Provider>
    )
};

export const useBundlrContext = () => useContext(BundlrContext);