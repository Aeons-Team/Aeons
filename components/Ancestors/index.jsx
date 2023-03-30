import { useRouter } from 'next/router'
import { useDriveStore } from '../../stores/DriveStore'
import style from './style.module.css'

export default function Ancestors() {
    const router = useRouter()
    const { id: activeFileId } = router.query

    const contractState = useDriveStore(state => state.contractState)
    const ancestors = contractState.getAncestors(activeFileId)

    return (
        <div className={style.ancestors}>
            {
                ancestors.map(file => (
                    <div className={style.ancestor} key={file.id} onClick={() => router.push(`/drive/${file.id}`)}>
                        {file.name}
                    </div>
                ))
            }
        </div>
    )
}