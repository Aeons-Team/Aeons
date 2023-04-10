import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from "react-responsive";
import copy from "clipboard-copy";
import { useAppState, useAppStore } from "../../stores/AppStore";
import { useDriveState } from "../../stores/DriveStore";
import style from "./style.module.css";
import FolderSelect from "../FolderSelect";
import InputForm from "../InputForm";
import Icon from '../Icon';

export default function ContextMenu() {
  const menuRef = useRef();
  const section1Ref = useRef()
  const section2Ref = useRef()
  const router = useRouter()
  const { id: activeFileId } = router.query
  const isMobile = useMediaQuery({ maxWidth: '500px' })
  const isMobileSm = useMediaQuery({ maxWidth: '350px' })
  const scale = isMobileSm ? 0.7 : (isMobile ? 0.8 : 1)

  const { uploadFiles, renameFile, createFolder, contractState, relocateFiles } = useDriveState(state => ({
    uploadFiles: state.uploadFiles,
    renameFile: state.renameFile,
    createFolder: state.createFolder,
    contractState: state.contractState,
    relocateFiles: state.relocateFiles
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

  useEffect(() => {
    const onClick = (e) => {
      if (!menuRef.current.contains(e.target) && contextMenuActivatedRef.current) {
        activateContextMenu(false);
        useAppStore.setState({ contextMenuAction: '' });
      }
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    contextMenuActivatedRef.current = contextMenuActivated
  }, [contextMenuActivated])

  useEffect(() => {
    if (contextMenuActivated) {
      const elem = !contextMenuAction ? section1Ref.current.children[0] : section2Ref.current.children[0]
      const bb = elem.getBoundingClientRect()

      setHeight(bb.height / scale)
      setWidth(bb.width / scale)
    }

    else {
      setHeight(0)
      setWidth(240)
    }

  }, [contextMenuAction, contextMenuOpts, isMobile])

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

        <p>Select the folder to which you'd like move all the selected files to</p>

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
            selection.length < 2 &&           
            <div
              className={style.contextMenuButton}
              onClick={() => {
                if (contextMenuOpts.file.contentType == 'folder') {
                  router.push(`/drive/${selection[0]}`)
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

          {contextMenuOpts.file.contentType != 'folder' && selection.length < 2 && (
            <div
              className={style.contextMenuButton}
              onClick={() => {
                activateContextMenu(false);
                useAppStore.setState({ contextMenuAction: '' });
                copy(
                  `${process.env.NEXT_PUBLIC_ARWEAVE_URL}/${
                    selection[0]
                  }`
                );
              }}
            >
              <span>
                <Icon width='1.65rem' height='1.65rem' name='url' />
              </span>

              Copy url
            </div>
          )}

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

          {selection.length < 2 && (
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
        left: contextMenuPosition.x + "px",
        top: contextMenuPosition.y + "px",
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
