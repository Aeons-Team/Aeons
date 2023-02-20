import { useBundlrContext } from "../../contexts/BundlrContext"
import Explorer from '../Explorer'
import Uploader from '../Uploader'

export default function Drive() {
    const bundlrClient = useBundlrContext()
    
    if (bundlrClient) {
        return (
            <>
                <Uploader />
                <Explorer />
            </>
        )
    }
};