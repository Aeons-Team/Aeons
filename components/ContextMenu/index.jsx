import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from "react-responsive";
import Crypto from "../../lib/Crypto";
import copy from "clipboard-copy";
import { useSpring } from "framer-motion"
import { useAppState, useAppStore } from "../../stores/AppStore";
import { useDriveState } from "../../stores/DriveStore";
import style from "./style.module.css";
import FolderSelect from "../FolderSelect";
import InputForm from "../InputForm";
import Icon from '../Icon';

export default function ContextMenu() {
  const router = useRouter()
  const { id: activeFileId } = router.query
  const isMobile = useMediaQuery({ maxWidth: '550px' })
  const isMobileSm = useMediaQuery({ maxWidth: '350px' })
  const scale = isMobileSm ? 0.7 : (isMobile ? 0.85 : 1)
  const menuRef = useRef();
  const section1Ref = useRef()
  const section2Ref = useRef()
  const explorerFilesRef = useRef()
  const x = useSpring(0, { stiffness: 200, damping: 24 })
  const y = useSpring(0, { stiffness: 200, damping: 24 })

  const { uploadFiles, renameFile, createFolder, contractState, relocateFiles, contract } = useDriveState(state => ({
    uploadFiles: state.uploadFiles,
    renameFile: state.renameFile,
    createFolder: state.createFolder,
    contractState: state.contractState,
    relocateFiles: state.relocateFiles,
    contract: state.contract
  }))
  
  const { contextMenuActivated, contextMenuPosition, contextMenuOpts, activateContextMenu, getSelection, contextMenuAction, clearSelection } = useAppState((state) => ({
    contextMenuActivated: state.contextMenuActivated,
    contextMenuPosition: state.contextMenuPosition,
    contextMenuOpts: state.contextMenuOpts,
    activateContextMenu: state.activateContextMenu,
    getSelection: state.getSelection,
    contextMenuAction: state.contextMenuAction,
    clearSelection: state.clearSelection
  }));

  const selection = getSelection()
  const contextMenuActivatedRef = useRef()
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const dimsRef = useRef([0, 0])

  useEffect(() => {
    const onClick = (e) => {
      if (!menuRef.current.contains(e.target) && contextMenuActivatedRef.current) {
        activateContextMenu(false);
        useAppStore.setState({ contextMenuAction: '' });
      }
    };

    document.addEventListener("click", onClick);

    explorerFilesRef.current = document.querySelector('#explorer-files')

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    if (contextMenuActivated) {
      const elem = !contextMenuAction ? section1Ref.current.children[0] : section2Ref.current.children[0]
      const bb = elem.getBoundingClientRect()

      dimsRef.current = [bb.height, bb.width]
      setHeight(dimsRef.current[0] / scale)
      setWidth(dimsRef.current[1] / scale)
    }

    else {
      setHeight(0)
      setWidth(240)
    }
  }, [contextMenuAction, contextMenuOpts, isMobile])

  useEffect(() => {
    contextMenuActivatedRef.current = contextMenuActivated

    if (contextMenuActivated) {
      const left = Math.min(contextMenuPosition.x, explorerFilesBB?.right - explorerFilesBB?.left - dimsRef.current[1] - 8)
      const top = Math.max(0, Math.min(contextMenuPosition.y, explorerFilesBB?.bottom + explorerFileScrollTop - explorerFilesBB?.top - dimsRef.current[0] - 8))

      x.jump(left)
      y.jump(top)
    }

  }, [contextMenuPosition.x, contextMenuPosition.y, contextMenuActivated])

  useEffect(() => {
    if (contextMenuActivated) {
      const left = Math.min(contextMenuPosition.x, explorerFilesBB?.right - explorerFilesBB?.left - dimsRef.current[1] - 8)
      const top = Math.max(0, Math.min(contextMenuPosition.y, explorerFilesBB?.bottom + explorerFileScrollTop - explorerFilesBB?.top - dimsRef.current[0] - 8))

      x.set(left)
      y.set(top)
    }
  }, [contextMenuAction])

  switch (contextMenuAction) {
    case "creatingFolder":
      var contextMenuInner = <InputForm 
        heading='Create Folder'
        fillIcon={false}
        icon='create-folder'
        description='create a folder with a name of your choice'
        onBack={() => {
          useAppStore.setState({ contextMenuAction: '' })
        }}

        onClick={async (input) => {
          const activation = useAppStore.getState().contextMenuActivation

          await createFolder(input, activeFileId)

          if (useAppStore.getState().contextMenuActivation == activation) {
            activateContextMenu(false);
          }
        }}
      
      />;
      break;

    case "moveFile":
      var contextMenuInner = <div className={style.moveFile}>
        <div className={style.moveFileHeader}>
          <Icon name='move' fill width='1.6rem' height='1.6rem' />
          <span>Move Files</span>
        </div>

        <p>Select the folder to which you would like move all the selected files to</p>

        <FolderSelect 
          itemDisabled={(id) => selection.includes(id)}
          disabled={(selectedFileId) => selection.filter((file) => !contractState.isRelocatable(file, selectedFileId)).length}
          onClick={async (selectedFileId) => {
            const activation = useAppStore.getState().contextMenuActivation

            clearSelection()
            await relocateFiles(selection, activeFileId, selectedFileId);
            
            if (useAppStore.getState().contextMenuActivation == activation) {
              activateContextMenu(false);
            }
          }}
          onBack={(e) => {
            e.stopPropagation()
            useAppStore.setState({ contextMenuAction: '' })
          }}
        />
      </div>
      break;

    case "rename":
      var contextMenuInner = <InputForm 
        heading='Rename'
        icon='rename'
        initialVal={contextMenuOpts.file.name}
        description='change the name of the currently selected file'
        onBack={() => {
          useAppStore.setState({ contextMenuAction: '' })
        }}

        onClick={async (input) => {
          const activation = useAppStore.getState().contextMenuActivation

          const fileId = getSelection()[0];
          clearSelection();
          await renameFile(fileId, input);

          if (useAppStore.getState().contextMenuActivation == activation) {
            activateContextMenu(false);
          }
        }}
      
      />;

      break;

  }

  switch (contextMenuOpts.type) {
    case "explorer":
      var contextMenuItems = (
        <>
          <input 
            id='upload-file' 
            type='file' 
            multiple 
            hidden 
            onChange={(e) => {
              uploadFiles(e.target.files, activeFileId)
              e.target.value = null
              activateContextMenu(false)
            }}
          />

          <input 
            id='upload-file-encrypted' 
            type='file' 
            multiple 
            hidden 
            onChange={(e) => {
              uploadFiles(e.target.files, activeFileId, true)
              e.target.value = null
              activateContextMenu(false)
            }}
          />

          <div
            className={style.contextMenuButton}
            onClick={(e) => {
              e.stopPropagation()
              useAppStore.setState({ contextMenuAction: "creatingFolder" })
            }}
          >
            <span>
              <Icon width='1.35rem' height='1.35rem' name='create-folder' strokeWidth={1.25} />
            </span>

            Create Folder
          </div>

          <div className={style.separator} />

          <label
            htmlFor='upload-file'
            className={style.contextMenuButton}
          >
            <span>
              <Icon width='1.3rem' height='1.3rem' name='upload-file' fill />
            </span>

            Upload Files
          </label>

          <label
            htmlFor='upload-file-encrypted'
            className={style.contextMenuButton}
          >
            <span>
              <Icon width='1.2rem' height='1.2rem' name='encrypted' fill />
            </span>

            Upload Private Files
          </label>
        </>
      );

      break;

    case "file":
      var contextMenuItems = (
        <>
          {     
            selection.length == 1 &&           
            <div
              className={style.contextMenuButton}
              onClick={async () => {
                const file = contextMenuOpts.file
                
                if (file.contentType == 'folder') {
                  router.push(`/drive/${selection[0]}`)
                }
                else if(file.encryption) {
                  const decryptedUrl = await Crypto.decryptedFileUrl(file.id, file.encryption, contract.internalWallet.privateKey, file.contentType)
                  window.open(decryptedUrl)
                }
                else {
                  window.open(`${process.env.NEXT_PUBLIC_ARWEAVE_URL}/${contextMenuOpts.file.id}`)
                }

                activateContextMenu(false)
              }}
            >
              <span>
                <Icon transform='translate(-1 0)' width='1.65rem' height='1.65rem' name='open' />
              </span>

              Open
            </div>
          }

          {contextMenuOpts.file.contentType != 'folder' && selection.length == 1 && (
            <div
              className={style.contextMenuButton}
              onClick={async () => {
                activateContextMenu(false);
                useAppStore.setState({ contextMenuAction: '' });
                
                const file = contextMenuOpts.file
                const decryptedUrl = await Crypto.decryptedFileUrl(file.id, file.encryption, contract.internalWallet.privateKey, file.contentType)
                
                copy( file.encryption ? decryptedUrl : `${process.env.NEXT_PUBLIC_ARWEAVE_URL}/${selection[0]}`);
              }}
            >
              <span>
                <Icon width='1.65rem' height='1.65rem' name='url' />
              </span>

              Copy url
            </div>
          )}

          {     
            selection.length == 1 && contextMenuOpts.file.contentType != 'folder' &&       
            <div
              className={style.contextMenuButton}
              onClick={async () => {
                const file = contextMenuOpts.file
                let src = `${process.env.NEXT_PUBLIC_ARWEAVE_URL}/${file.id}`

                if (file.encryption) {
                  src = await Crypto.decryptContractFile(file, contract.internalWallet.privateKey)
                }

                const a = document.createElement('a')
                a.download = file.name 
                a.href = src

                a.click()

                URL.revokeObjectURL(src)

                activateContextMenu(false)
              }}
            >
              <span>
                <Icon width='1.65rem' height='1.65rem' name='download' />
              </span>

              Download
            </div>
          }

          {
            selection.length == 1 &&
            <div className={style.separator} />
          }

          <div
            className={style.contextMenuButton}
            onClick={(e) => {
              e.stopPropagation()
              useAppStore.setState({ contextMenuAction: "moveFile" });
            }}
          >
            <span>
              <Icon width='1.3rem' height='1.3rem' name='move' fill />
            </span>

            Move
          </div>

          {selection.length == 1 && (
            <div
              className={style.contextMenuButton}
              onClick={(e) => {
                e.stopPropagation()
                useAppStore.setState({ contextMenuAction: "rename" });
              }}
            >
              <span>
                <Icon width='1.5rem' height='1.5rem' name='rename' fill />
              </span>

              Rename
            </div>
          )}

          <div
            className={style.contextMenuButton}
            const onClick={async () => {
              
              activateContextMenu(false);
              await relocateFiles(selection, activeFileId, "archive");
            }}
          >
            <span>
              <Icon width='1.45rem' height='1.45rem' name='archive' strokeWidth={11} />
            </span>
            
            Archive
          </div>
        </>
      );

      break;
  }

  const explorerFilesBB = explorerFilesRef.current?.getBoundingClientRect()
  const explorerFileScrollTop = explorerFilesRef.current?.scrollTop

  return (
    <motion.div
      ref={menuRef}
      className={style.contextMenu}
      animate={{ 
        height,
        width
      }}
      style={{
        pointerEvents: contextMenuActivated ? "auto" : "none",
        left: x,
        top: y
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <AnimatePresence>
        {
          contextMenuActivated && !contextMenuAction &&
          <motion.div 
            ref={section1Ref}
            key='menuItems'
            className={style.section}
            initial={{ left: '-50%', opacity: 0 }} 
            animate={{ left: '0%', opacity: 1 }} 
            exit={{ left: '-50%', opacity: 0 }}
          >
            <div>{contextMenuItems}</div>
          </motion.div>
        }

        {
          contextMenuActivated && contextMenuAction &&
          <motion.div 
            ref={section2Ref}
            key='menuInner'
            className={style.section}
            initial={{ left: '50%', opacity: 0 }} 
            animate={{ left: '0%', opacity: 1 }} 
            exit={{ left: '50%', opacity: 0 }}
          >
            {contextMenuInner}
          </motion.div>
        }
      </AnimatePresence>
    </motion.div>
  );
}
