import { BundlrContextProvider } from '../contexts/BundlrContext'
import { AppContextProvider } from '../contexts/AppContext'
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <BundlrContextProvider>
      <AppContextProvider>
        <Component {...pageProps} />
      </AppContextProvider>
    </BundlrContextProvider>
  )
}

export default MyApp
