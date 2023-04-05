import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import copy from "clipboard-copy";
import { useAppState, useAppStore } from "../../stores/AppStore";
import { useDriveState } from "../../stores/DriveStore";
import style from "./style.module.css";
import FolderSelect from "../FolderSelect";
import InputForm from "../InputForm";
import Icon from '../Icon';

export default function ContextMenu() {
  const menuRef = useRef();
  const router = useRouter()
  const { id: activeFileId } = router.query

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

  switch (contextMenuAction) {
    case "creatingFolder":
      var contextMenuInner = <InputForm 
        heading='Create Folder'
        icon='folder'
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
          <Icon name='move' fill width='1.5rem' height='1.5rem' />
          <span>Move Files</span>
        </div>

        <p>Select the folder to which you'd like move all the selected files to</p>

        <FolderSelect 
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

    default:
      switch (contextMenuOpts.type) {
        case "explorer":
          var contextMenuInner = (
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

              <label
                htmlFor='upload-file'
                className={style.contextMenuButton}
              >
                <span>
                  <Icon width='1.5rem' height='1.5rem' name='upload-file' fill />
                </span>

                Upload File
              </label>

              <div
                className={style.contextMenuButton}
                onClick={(e) => {
                  e.stopPropagation()
                  useAppStore.setState({ contextMenuAction: "creatingFolder" })
                }}
              >
                <span>
                  <Icon width='1.5rem' height='1.5rem' name='folder' />
                </span>

                Create Folder
              </div>
            </>
          );

          break;

        case "file":
          var contextMenuInner = (
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
                    <Icon width='1.65rem' height='1.65rem' name='open' />
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

              <div className={style.separator} />

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
  }

  return (
    <div
      ref={menuRef}
      className={style.contextMenu}
      style={{
        pointerEvents: contextMenuActivated ? "auto" : "none",
        left: contextMenuPosition.x + "px",
        top: contextMenuPosition.y + "px",
      }}
    >
      {contextMenuActivated && contextMenuInner}
    </div>
  );
}
