import { BundlrContextProvider } from '../contexts/BundlrContext'
import { AppContextProvider } from '../contexts/AppContext'
import Drive from '../components/Drive'

export default function Home() {
  return (
    <BundlrContextProvider>
      <AppContextProvider>
        <Drive />
      </AppContextProvider>
    </BundlrContextProvider>
  )
}
