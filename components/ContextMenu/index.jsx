import { useState, useEffect, useRef } from "react";
import copy from "clipboard-copy";
import { useAppState } from "../../stores/AppStore";
import Uploader from "../Uploader";
import style from "./style.module.css";
import FolderSelect from "../FolderSelect";
import Creator from "../Creator";

export default function ContextMenu() {
  const menuRef = useRef();
  const [
    contextMenuActivated,
    contextMenuPosition,
    contextMenuOpts,
    activateContextMenu,
    getSelection,
  ] = useAppState((state) => [
    state.contextMenuActivated,
    state.contextMenuPosition,
    state.contextMenuOpts,
    state.activateContextMenu,
    state.getSelection,
  ]);
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
      var contextMenuInner = <Creator type="Folder" />;
      break;

    case "fundingWallet":
      var contextMenuInner = <Creator type="Fund" />;
      break;

    case "moveFile":
      var contextMenuInner = <FolderSelect />;
      break;

    case "rename":
      var contextMenuInner = <Creator type="New" />;
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
                Upload File
              </div>

              <div
                className={style.contextMenuButton}
                onClick={() => setAction("creatingFolder")}
              >
                Create Folder
              </div>

              <div
                className={style.contextMenuButton}
                onClick={() => setAction("fundingWallet")}
              >
                Fund Wallet
              </div>
            </>
          );

          break;

        case "file":
          var contextMenuInner = (
            <>
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
                  Copy url
                </div>
              )}

              <div
                className={style.contextMenuButton}
                onClick={() => {
                  setAction("moveFile");
                }}
              >
                Move
              </div>
              {getSelection().length < 2 && (
                <div
                  className={style.contextMenuButton}
                  onClick={() => {
                    setAction("rename");
                  }}
                >
                  Rename
                </div>
              )}
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
