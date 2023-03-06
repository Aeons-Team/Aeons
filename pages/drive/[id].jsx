import { useEffect } from "react";
import { useRouter } from "next/router";
import { useBundlrState } from "../../stores/BundlrStore";
import Drive from "../../components/Drive";

function DrivePage() {
    const router = useRouter()
    const { id } = router.query
    const [initialized, setCurrentFile] = useBundlrState(state => [state.initialized, state.setCurrentFile])

    useEffect(() => {
        if (initialized) setCurrentFile(id)
    }, [id, initialized])

    if (initialized) {
        return <Drive />
    }
}

export default DrivePage