import { useAppState, useAppStore } from '../../stores/AppStore'
import Spinner from 'react-spinner-material'
import IconButton from '../IconButton'
import Icon from '../Icon'
import Utility from '../../lib/Utility'
import style from './style.module.css'

export default function FolderInfo({ file }) {
    const { activateContextMenu, select, getSelection, clearSelection } = useAppState(state => ({
        activateContextMenu: state.activateContextMenu,
        select: state.select,
        getSelection: state.getSelection,
        clearSelection: state.clearSelection
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
                            if (getSelection().length == 1) {
                                clearSelection()
                            }

                            select(file.id)
                        }

                        activateContextMenu(true, {
                            type: "file",
                            file
                        })
                    }}
                />
            }

            {
                file.pending &&
                <Spinner className={style.spinner} radius={13} stroke={1} color='var(--color-active)' />
            }

            <div className={style.folderHeader}>
                <Icon name='folder' width='2rem' height='2rem' fill color='var(--color-active)' />

                <span className={style.folderName}>{file.name}</span>
            </div>

            <div className={style.folderDetails}>
                <span>{file.children.length} files</span>
                <span>{Utility.formatDate(file.createdAt)}</span>
            </div>
        </div>
    )
}