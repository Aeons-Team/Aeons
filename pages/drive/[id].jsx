import { useBundlrStore } from "../../stores/BundlrStore";
import Drive from "../../components/Drive";

function DrivePage() {
    const initialized = useBundlrStore(state => state.initialized)
    
    if (initialized) {
        return <Drive />
    }
}

export default DrivePage