import { BundlrContextProvider } from '../contexts/BundlrContext'
import Drive from '../components/Drive'

export default function Home() {
  return (
    <BundlrContextProvider>
      <Drive />
    </BundlrContextProvider>
  )
}
