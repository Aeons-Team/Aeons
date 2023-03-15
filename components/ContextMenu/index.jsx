import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import copy from "clipboard-copy";
import { useAppState } from "../../stores/AppStore";
import FileUploader from "../FileUploader";
import style from "./style.module.css";
import Hierarchy from "../Hierarchy";
import Creator from "../Creator";

export default function ContextMenu() {
  const router = useRouter();
  const menuRef = useRef();
  const [
    contextMenuActivated,
    contextMenuPosition,
    contextMenuOpts,
    activateContextMenu,
  ] = useAppState((state) => [
    state.contextMenuActivated,
    state.contextMenuPosition,
    state.contextMenuOpts,
    state.activateContextMenu,
  ]);
  const [action, setAction] = useState();
  const [fileId, setFileId] = useState();

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
      var contextMenuInner = <FileUploader />;
      break;

    case "creatingFolder":
      var contextMenuInner = <Creator type="Folder" />;
      break;

    case "fundingWallet":
      var contextMenuInner = <Creator type="Fund" />;
      break;

    case "moveFile":
      var contextMenuInner = <Hierarchy fileId={fileId} />;
      break;

    case "rename":
      var contextMenuInner = <Creator type="New" fileId={fileId} />;
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

        case "hierarchy":
          var contextMenuInner = (
            <>
              <div
                className={style.contextMenuButton}
                onClick={() => {
                  activateContextMenu(false);
                  setAction();
                  router.push(`/drive/${contextMenuOpts.file.id}`);
                }}
              >
                open
              </div>
            </>
          );
          break;

        case "file":
          var contextMenuInner = (
            <>
              {contextMenuOpts.copy && (
                <div
                  className={style.contextMenuButton}
                  onClick={() => {
                    activateContextMenu(false);
                    setAction();
                    copy(
                      `${process.env.NEXT_PUBLIC_ARWEAVE_URL}${contextMenuOpts.file.id}`
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
                  setFileId(contextMenuOpts.file.id);
                }}
              >
                Move
              </div>
              <div
                className={style.contextMenuButton}
                onClick={() => {
                  setAction("rename");
                  setFileId(contextMenuOpts.file.id);
                }}
              >
                Rename
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
