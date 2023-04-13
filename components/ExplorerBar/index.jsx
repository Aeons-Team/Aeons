import { useRouter } from 'next/router'
import { useMediaQuery } from 'react-responsive'
import Ancestors from '../Ancestors'
import IconButton from '../IconButton'
import { useAppState, useAppStore } from '../../stores/AppStore'
import { useDriveStore } from '../../stores/DriveStore'
import style from './style.module.css'

export default function ExplorerBar() {
    const router = useRouter()
    const { id: activeFileId } = router.query
    const isMobile = useMediaQuery({ maxWidth: '550px' })

    const { getSelection, clearSelection, activateContextMenu } = useAppState(state => ({
        getSelection: state.getSelection,
        clearSelection: state.clearSelection,
        activateContextMenu: state.activateContextMenu
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
                        useAppStore.getState().clearDragging()
                    }            
                }}
                onDragEnter={(e) => e.preventDefault()}
                gap='0.1rem'
                listStyle={{
                    paddingLeft: '0.25rem'
                }}
                itemStyle={{
                    padding: isMobile ? '0.35rem 0rem' : '0.35rem 0.75rem',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    minWidth: '3rem',
                    maxWidth: '10rem'
                }}
            />

            <IconButton 
                name='add'
                width='1.5rem'
                height='1.5rem'
                fill
                color='var(--color-active)'
                onClick={(e) => {
                    e.stopPropagation()

                    activateContextMenu(true, {
                        type: 'explorer'
                    })
                }}
            />
        </div>
    )
}