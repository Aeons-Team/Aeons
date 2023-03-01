import { useEffect } from 'react'
import { useRouter } from "next/router";
import Drive from '../../components/Drive';
import { useAppContext } from "../../contexts/AppContext";

function DrivePage() {
    const router = useRouter()
    const { id } = router.query
    const { setCurrentFile } = useAppContext()

    useEffect(() => {
        setCurrentFile(id)
    }, [id])

    return (
        <Drive />
    )
}

export default DrivePage