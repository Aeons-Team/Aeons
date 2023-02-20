import { BundlrContextProvider } from '../contexts/BundlrContext'
import Uploader from '../components/Uploader'

export default function Home() {
  return (
    <BundlrContextProvider>
      <Uploader />
    </BundlrContextProvider>
  )
}
