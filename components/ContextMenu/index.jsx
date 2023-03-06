import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import copy from "clipboard-copy";
import { motion } from "framer-motion";
import { useAppState } from "../../stores/AppStore";
import FileUploader from "../FileUploader";
import FolderCreator from "../FolderCreator";
import Funder from "../Funder";
import style from "./style.module.css";
import DriveCreator from "../DriveCreator";
import MoveFile from "../MoveFile"

export default function ContextMenu() {
  const router = useRouter()
  const menuRef = useRef();
  const [contextMenuActivated, contextMenuPosition, contextMenuOpts, activateContextMenu] = useAppState(state => [state.contextMenuActivated, state.contextMenuPosition, state.contextMenuOpts, state.activateContextMenu]);
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
      var contextMenuInner = <FileUploader />;
      break;

    case "creatingFolder":
      var contextMenuInner = <FolderCreator />;
      break;

    case "creatingDrive":
      var contextMenuInner = <DriveCreator />;
      break;

    case "fundingWallet":
      var contextMenuInner = <Funder />;
      break;
     
    case "moveFile":
      var contextMenuInner = <MoveFile />
      break;  

    default:
      switch (contextMenuOpts.type) {
        case "explorer":
          var contextMenuInner = (
            <>
              <div
                className={style.contextMenuButton}
                onClick={() => setAction("creatingDrive")}
              >
                Create Drive
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
        case "drive":
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
                  router.push(`/drive/${contextMenuOpts.data.id}`);
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
              {
                contextMenuOpts.copy && 
                <div
                  className={style.contextMenuButton}
                  onClick={() => {
                    activateContextMenu(false);
                    setAction();
                    copy(`${process.env.NEXT_PUBLIC_ARWEAVE_URL}${contextMenuOpts.data.id}`);
                  }}
                >
                  
                  Copy url
                </div>
              }

              <div
                className={style.contextMenuButton}
                onClick={() => setAction('moveFile')}
              >
                  Move
              </div>
            </>
          );

          break;
      }
  }

  return (
    <motion.div
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
    </motion.div>
  );
}