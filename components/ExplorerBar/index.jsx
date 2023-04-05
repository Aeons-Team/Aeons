import { useRouter } from 'next/router'
import Ancestors from '../Ancestors'
import ExplorerActions from '../ExplorerActions'
import { useAppState } from '../../stores/AppStore'
import { useDriveStore } from '../../stores/DriveStore'
import style from './style.module.css'

export default function ExplorerBar() {
    const router = useRouter()
    const { id: activeFileId } = router.query

    const { getSelection, clearSelection } = useAppState(state => ({
        getSelection: state.getSelection,
        clearSelection: state.clearSelection   
    }))

    const relocateFiles = useDriveStore(state => state.relocateFiles)

    return (
        <div className={style.explorerBar}>
            <Ancestors 
                id={activeFileId} 
                iconSize='0.75rem'
                onClick={(file) => router.push(`/drive/${file.id}`)}
                onDrop={(file) => {
                    if (file.id != activeFileId) {
                        relocateFiles(getSelection(), activeFileId, file.id)
                        clearSelection()
                    }            
                }}
                onDragOver={(e) => e.preventDefault()}
                gap='0.25rem'
                itemStyle={{
                    padding: '0.5rem 1rem',
                    minWidth: '3rem',
                    maxWidth: '10rem'
                }}
            />
            <ExplorerActions />
        </div>
    )
}