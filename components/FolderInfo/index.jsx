import { useAppState, useAppStore } from '../../stores/AppStore'
import IconButton from '../IconButton'
import Icon from '../Icon'
import style from './style.module.css'

export default function FolderInfo({ file }) {
    const { activateContextMenu, select } = useAppState(state => ({
        activateContextMenu: state.activateContextMenu,
        select: state.select
    }))

    return (
        <div className={style.folderInfo}>
            <Icon name='folder' width='1.5rem' height='1.5rem' />

            <span>{file.name}</span>

            <IconButton 
                name='dots-horizontal' 
                fill 
                onClick={(e) => {
                    e.stopPropagation()

                    const appState = useAppStore.getState()

                    if (!appState.selected[file.id]) {
                        select(file.id)
                    }

                    activateContextMenu(true, {
                        type: "file",
                        copy: file.contentType != 'folder',
                        file,
                    })
                }}
            />
        </div>
    )
}