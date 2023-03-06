import { useEffect } from 'react';
import { useBundlrStore } from '../stores/BundlrStore';
import { useAppStore } from '../stores/AppStore';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const initialize = useBundlrStore(state => state.initialize);
  const cursorPosition = useAppStore(state => state.cursorPosition);

  useEffect(() => {
    initialize()

    const onMouseMove = (e) => {
      cursorPosition.set(e.clientX, e.clientY + document.documentElement.scrollTop);
    };

    document.addEventListener("mousemove", onMouseMove);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);
 
  return (
    <Component {...pageProps} />
  )
}

export default MyApp
