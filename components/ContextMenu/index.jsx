import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import copy from "clipboard-copy";
import { useAppState } from "../../stores/AppStore";
import Uploader from "../Uploader";
import style from "./style.module.css";
import FolderSelect from "../FolderSelect";
import FolderCreator from "../FolderCreator";
import Rename from "../Rename";
import Icon from '../Icon';

export default function ContextMenu() {
  const menuRef = useRef();
  const router = useRouter()
  
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
      activateContextMenu(false);
      setAction();
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);

  switch (action) {
    case "uploadingFile":
      var contextMenuInner = <Uploader />;
      break;

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
              <div
                className={style.contextMenuButton}
                onClick={() => setAction("uploadingFile")}
              >
                <Icon name='upload-file' fill />

                Upload File
              </div>

              <div
                className={style.contextMenuButton}
                onClick={() => setAction("creatingFolder")}
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
                onClick={() => {
                  setAction("moveFile");
                }}
              >
                <Icon name='move' fill />

                Move
              </div>

              {getSelection().length < 2 && (
                <div
                  className={style.contextMenuButton}
                  onClick={() => {
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
      onClick={(e) => {
        e.stopPropagation();
      }}
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
