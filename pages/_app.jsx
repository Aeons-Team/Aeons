import { useEffect } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { useBundlrStore } from "../stores/BundlrStore";
import { useAppStore } from "../stores/AppStore";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const initialize = useBundlrStore((state) => state.initialize);
  const cursorPosition = useAppStore((state) => state.cursorPosition);

  useEffect(() => {
    async function init() {
      const web3Auth = new Web3Auth({
        clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
        web3AuthNetwork: "testnet",
        chainConfig: {
          chainNamespace: "eip155",
          chainId: "0xA4B1",
          rpcTarget: "https://rpc.ankr.com/arbitrum",
          displayName: "Arbitrum Mainnet",
          blockExplorer: "https://arbiscan.io",
          ticker: "AETH",
          tickerName: "AETH",
        },
        uiConfig: {
          appName: "XDrive",
          defaultLanguage: "en",
          modalZIndex: 5000,
          theme: "dark",
        },
        enableLogging: false,
      });

      await web3Auth.initModal();

      const provider = await web3Auth.connect();

      initialize(provider);
    }

    init();

    const onMouseMove = (e) => {
      cursorPosition.set(
        e.clientX,
        e.clientY + document.documentElement.scrollTop
      );
    };

    document.addEventListener("mousemove", onMouseMove);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
