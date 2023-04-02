import { useRouter } from 'next/router'
import { useDriveStore } from '../../stores/DriveStore'
import { useAppState } from '../../stores/AppStore'
import style from './style.module.css'

function Ancestor({ file }) {
    const router = useRouter()
    const { id: activeFileId } = router.query

    const { getSelection, clearSelection } = useAppState(state => ({
        getSelection: state.getSelection,
        clearSelection: state.clearSelection   
    }))

    const relocateFiles = useDriveStore(state => state.relocateFiles)

    const onAncestorDrop = () => {
        if (file.id != activeFileId) {
            relocateFiles(getSelection(), activeFileId, file.id)
            clearSelection()
        }
    }

    const onAncestorDragOver = (e) => {
        e.preventDefault()
    }

    return (
        <div 
            className={style.ancestor} 
            onClick={() => router.push(`/drive/${file.id}`)}
            onDrop={onAncestorDrop}
            onDragOver={onAncestorDragOver}
        >
            {file.name}
        </div>
    )
}


export default function Ancestors({ id }) {
    const contractState = useDriveStore(state => state.contractState)
    const ancestors = contractState.getAncestors(id)

    return (
        <div className={style.ancestors}>
            {
                ancestors.map(file => <Ancestor key={file.id} file={file} />)
            }
        </div>
    )
}