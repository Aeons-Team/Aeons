import { useRouter } from 'next/router'
import copy from 'clipboard-copy'
import { useAppStore, useAppState } from '../../stores/AppStore'
import { useDriveStore } from '../../stores/DriveStore'
import IconButton from '../IconButton'
import style from './style.module.css'

export default function ExplorerActions() {
    const router = useRouter()

    const { selected, getSelection, activateContextMenu } = useAppState(state => ({
        selected: state.selected,
        getSelection: state.getSelection,
        activateContextMenu: state.activateContextMenu
    }))

    const contractState = useDriveStore((state) => state.contractState)

    const selection = getSelection()

    return (
        <div className={style.actions}>
            {
                selection.length == 1 &&
                <>
                    <IconButton 
                        name='open' 
                        width='1.25rem'
                        height='1.25rem'
                        onClick={() => {
                            const file = contractState.getFile(selection[0])

                            if (file.contentType == 'folder') {
                                router.push(`/drive/${selection[0]}`)
                            }

                            else {
                                window.open(`${process.env.NEXT_PUBLIC_ARWEAVE_URL}/${file.id}`)
                            }
                        }}
                    />

                    {   
                        contractState.getFile(selection[0]).contentType != 'folder' &&
                        <IconButton 
                            name='url' 
                            width='1.25rem'
                            height='1.25rem'
                            onClick={() => copy(`${process.env.NEXT_PUBLIC_ARWEAVE_URL}/${selection[0]}`)}
                        />
                    }

                    <IconButton 
                        name='rename' 
                        fill
                        width='1.15rem'
                        height='1.15rem'
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
                        width='1.05rem'
                        height='1.05rem'
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
                        width='1.05rem'
                        height='1.05rem'
                        strokeWidth={12}
                    />
                </>
            }            
        </div>
    )
}