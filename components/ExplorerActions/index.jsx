import { useRouter } from 'next/router'
import copy from 'clipboard-copy'
import { useAppStore, useAppState } from '../../stores/AppStore'
import { useDriveStore } from '../../stores/DriveStore'
import IconButton from '../IconButton'
import style from './style.module.css'

export default function ExplorerActions() {
    const router = useRouter()

    const { explorerView, selected, getSelection, activateContextMenu } = useAppState(state => ({
        explorerView: state.explorerView,
        selected: state.selected,
        getSelection: state.getSelection,
        activateContextMenu: state.activateContextMenu
    }))

    const contractState = useDriveStore((state) => state.contractState)

    const otherView = explorerView == 'grid' ? 'list' : 'grid'
    const selection = getSelection()

    return (
        <div className={style.actions}>
            {
                selection.length == 0 &&
                <IconButton 
                    name={otherView} 
                    onClick={() => useAppStore.setState({ explorerView: otherView })} 
                />
            }

            {
                selection.length == 1 &&
                <>
                    <IconButton 
                        name='open' 
                        onClick={() => router.push(`/drive/${selection[0]}`)}
                    />

                    {   
                        contractState.getFile(selection[0]).contentType != 'folder' &&
                        <IconButton 
                            name='url' 
                            onClick={() => copy(`${process.env.NEXT_PUBLIC_ARWEAVE_URL}/${selection[0]}`)}
                        />
                    }

                    <IconButton 
                        name='rename' 
                        fill
                        onClick={(e) => {
                            e.stopPropagation()

                            const file = contractState.getFile(selection[0])

                            activateContextMenu(true, {
                                type: 'file',
                                file,
                                action: 'rename'
                            })
                        }}
                    />
                </>
            }
            
            {
                selection.length > 0 &&
                <>
                    <IconButton 
                        name='move'
                        fill 
                        onClick={(e) => {
                            e.stopPropagation()

                            const file = contractState.getFile(selection[0])

                            activateContextMenu(true, {
                                type: 'file',
                                file,
                                action: 'moveFile'
                            })
                        }}
                    />

                    <IconButton 
                        name='archive' 
                    />
                </>
            }            
        </div>
    )
}