import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import copy from "clipboard-copy";
import { useAppState } from "../../stores/AppStore";
import style from "./style.module.css";
import FolderSelect from "../FolderSelect";
import FolderCreator from "../FolderCreator";
import Rename from "../Rename";
import Icon from '../Icon';
import { useDriveStore } from "../../stores/DriveStore";

export default function ContextMenu() {
  const menuRef = useRef();
  const router = useRouter()
  const { id: activeFileId } = router.query

  const uploadFiles = useDriveStore(state => state.uploadFiles)
  
  const { contextMenuActivated, contextMenuPosition, contextMenuOpts, activateContextMenu, getSelection } = useAppState((state) => ({
    contextMenuActivated: state.contextMenuActivated,
    contextMenuPosition: state.contextMenuPosition,
    contextMenuOpts: state.contextMenuOpts,
    activateContextMenu: state.activateContextMenu,
    getSelection: state.getSelection,
  }));

  const [action, setAction] = useState();

  useEffect(() => {
    const onClick = (e) => {
      if (!menuRef.current.contains(e.target)) {
        activateContextMenu(false);
        setAction(); 
      }
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);

  switch (action) {
    case "creatingFolder":
      var contextMenuInner = <FolderCreator />;
      break;

    case "moveFile":
      var contextMenuInner = <FolderSelect />;
      break;

    case "rename":
      var contextMenuInner = <Rename />;
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
                <Icon name='upload-file' fill />

                Upload File
              </label>

              <div
                className={style.contextMenuButton}
                onClick={(e) => {
                  e.stopPropagation()
                  setAction("creatingFolder")
                }}
              >
                <Icon name='folder' />

                Create Folder
              </div>
            </>
          );

          break;

        case "file":
          var contextMenuInner = (
            <>
              <div
                className={style.contextMenuButton}
                onClick={() => {
                  router.push(`/drive/${getSelection()[0]}`)
                }}
              >
                <Icon name='open' />

                Open
              </div>

              {contextMenuOpts.copy && getSelection().length < 2 && (
                <div
                  className={style.contextMenuButton}
                  onClick={() => {
                    activateContextMenu(false);
                    setAction();
                    copy(
                      `${process.env.NEXT_PUBLIC_ARWEAVE_URL}/${
                        getSelection()[0]
                      }`
                    );
                  }}
                >
                  <Icon name='url' />

                  Copy url
                </div>
              )}

              <div
                className={style.contextMenuButton}
                onClick={(e) => {
                  e.stopPropagation()
                  setAction("moveFile");
                }}
              >
                <Icon name='move' fill />

                Move
              </div>

              {getSelection().length < 2 && (
                <div
                  className={style.contextMenuButton}
                  onClick={(e) => {
                    e.stopPropagation()
                    setAction("rename");
                  }}
                >
                  <Icon name='rename' fill />

                  Rename
                </div>
              )}

              <div
                className={style.contextMenuButton}
              >
                <Icon name='archive' />
                
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
