import { useRouter } from 'next/router'
import copy from 'clipboard-copy'
import { AnimatePresence } from 'framer-motion'
import { useAppState } from '../../stores/AppStore'
import { useDriveState } from '../../stores/DriveStore'
import IconButton from '../IconButton'
import style from './style.module.css'

export default function ExplorerActions() {
    const router = useRouter()
    const { id: activeFileId } = router.query

    const { selected, getSelection, activateContextMenu } = useAppState(state => ({
        selected: state.selected,
        getSelection: state.getSelection,
        activateContextMenu: state.activateContextMenu
    }))

    const { contractState, uploadFiles, relocateFiles } = useDriveState((state) => ({
        contractState: state.contractState,
        uploadFiles: state.uploadFiles,
        relocateFiles: state.relocateFiles
    }))

    const selection = getSelection()

    const animations = {
        initial: {
            opacity: 0,
            y: 5
        },
        
        animate: {
            opacity: 1,
            y: 0
        },

        exit: {
            opacity: 0,
            y: 5
        },

        transition: {
            ease: 'easeInOut',
            duration: 0.2
        }
    }

    return (
        <div className={style.actions}>
            <AnimatePresence>
            {
                selection.length == 1 &&
                <IconButton 
                    key='open-icon'
                    {...animations}
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
            }

            {   
                selection.length == 1 && contractState.getFile(selection[0]).contentType != 'folder' &&
                <IconButton 
                    key='url-icon'
                    {...animations}
                    name='url' 
                    width='1.25rem'
                    height='1.25rem'
                    onClick={() => copy(`${process.env.NEXT_PUBLIC_ARWEAVE_URL}/${selection[0]}`)}
                />
            }


            {
                selection.length == 1 &&
                <IconButton 
                    key='rename-icon'
                    {...animations}
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
            }
            
            {
                selection.length > 0 &&
                <IconButton 
                    key='move-icon'
                    {...animations}
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
            }            

            {
                selection.length > 0 &&
                <IconButton 
                    key='archive-icon'
                    {...animations}
                    name='archive' 
                    width='1.05rem'
                    height='1.05rem'
                    strokeWidth={10}

                    onClick={(e) => {
                        e.stopPropagation()

                        relocateFiles(selection, activeFileId, "archive");
                    }}
                />
            }

            {
                selection.length == 0 &&
                <div className={style.defaultActions}>
                    <input 
                        id='upload-file-2' 
                        type='file'
                        multiple 
                        hidden 
                        onChange={(e) => {
                            uploadFiles(e.target.files, activeFileId)
                            e.target.value = null
                        }}
                    />
                    
                    <IconButton 
                        key='create-folder'
                        {...animations}
                        name='create-folder' 
                        width='1rem'
                        height='1rem'
                        onClick={(e) => {
                            e.stopPropagation()

                            activateContextMenu(true, {
                                type: 'explorer',
                                action: 'creatingFolder'
                            })
                        }}
                    />
                    
                    <IconButton 
                        key='upload-file'
                        {...animations}
                        name='upload-file' 
                        width='1rem'
                        height='1rem'
                        fill
                        onClick={() => document.querySelector('#upload-file-2').click()}
                    />
                </div>
            }
            </AnimatePresence>
        </div>
    )
}