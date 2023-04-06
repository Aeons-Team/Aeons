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
      
      initialize(new ethers.providers.Web3Provider(window.ethereum));

      window.ethereum.on('accountsChanged', () => {
        initialize(new ethers.providers.Web3Provider(window.ethereum));
      })
      
      window.ethereum.on('chainChanged', () => {
        initialize(new ethers.providers.Web3Provider(window.ethereum));
      })
    }

    init();

    const onMouseMove = (e) => {
      cursorPosition.set(
        e.clientX,
        e.clientY + document.documentElement.scrollTop
      );
    };

    const onKeyDown = (e) => {
      switch (e.key) {
        case 'Shift':
          useAppStore.setState({ holdingShift: true })
          break 

        case 'Control':
          useAppStore.setState({ holdingControl: true })
          break 
      }
    }

    const onKeyUp = (e) => {
      switch (e.key) {
        case 'Shift':
          useAppStore.setState({ holdingShift: false })
          break 

        case 'Control':
          useAppStore.setState({ holdingControl: false })
          break 
      }
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
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
