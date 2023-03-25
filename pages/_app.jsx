import { useEffect } from "react";
import { ethers } from "ethers";
import { useDriveStore } from "../stores/DriveStore";
import { useAppStore } from "../stores/AppStore";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const initialize = useDriveStore((state) => state.initialize);
  const cursorPosition = useAppStore((state) => state.cursorPosition);

  useEffect(() => {
    async function init() {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
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
