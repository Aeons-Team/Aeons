import { useEffect } from "react";
import { ethers } from "ethers";
import { useDriveState } from "../stores/DriveStore";
import { useAppStore } from "../stores/AppStore";
import Drive from "../components/Drive";
import "../styles/globals.css";

function App({ Component, pageProps }) {
  const { initialize, initialized } = useDriveState((state) => ({
    initialize: state.initialize,
    initialized: state.initialized
  }));

  const cursorPosition = useAppStore((state) => state.cursorPosition);

  useEffect(() => {
    async function init() {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await initialize(provider);
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

  if (initialized) {
    return (
      <Drive>
        <Component {...pageProps} />
      </Drive>
    )
  }
}

export default App;
