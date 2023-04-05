import { useAppState, useAppStore } from '../../stores/AppStore'
import IconButton from '../IconButton'
import Icon from '../Icon'
import Utility from '../../lib/Utility'
import style from './style.module.css'

export default function FolderInfo({ file }) {
    const { activateContextMenu, select } = useAppState(state => ({
        activateContextMenu: state.activateContextMenu,
        select: state.select
    }))

    return (
        <div className={style.folderInfo}>
            {
                !file.pending &&
                <IconButton 
                    className={style.folderInfoMenu}
                    name='dots-vertical' 
                    strokeWidth={2}
                    onClick={(e) => {
                        e.stopPropagation()

                        const appState = useAppStore.getState()

                        if (!appState.selected[file.id]) {
                            select(file.id)
                        }

                        activateContextMenu(true, {
                            type: "file",
                            file
                        })
                    }}
                />
            }

            <div className={style.folderHeader}>
                <Icon name='folder' width='2rem' height='2rem' fill />

                <span className={style.folderName}>{file.name}</span>
            </div>

            <div className={style.folderDetails}>
                <span>{file.children.length} files</span>

                <span>{Utility.formatDate(file.createdAt)}</span>
            </div>
        </div>
    )
}