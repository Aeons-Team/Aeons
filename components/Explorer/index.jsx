import { useRouter } from "next/router";
import { useRef } from "react";
import { useAppState, useAppStore } from "../../stores/AppStore";
import { useDriveState } from "../../stores/DriveStore";
import ExplorerBar from '../ExplorerBar'
import ExplorerFiles from "../ExplorerFiles";
import style from "./style.module.css";

export default function Explorer() {
  const explorerRef = useRef()
  const countRef = useRef(0)

  const { id: activeFileId } = useRouter().query;
  const { getSelection, clearSelection } = useAppState((state) => ({
    getSelection: state.getSelection,
    clearSelection: state.clearSelection
  }));
  
  const { contractState, uploadFiles } = useDriveState((state) => ({
    contractState: state.contractState,
    uploadFiles: state.uploadFiles
  }));

  const activeFileChildren = contractState.getChildren(activeFileId);

  const onExplorerDrop = async (e) => {
    e.preventDefault();

    countRef.current = 0
    explorerRef.current.classList.remove(style.dragEnter)

    clearSelection();
    useAppStore.getState().clearDragging();

    if (e.dataTransfer.files.length) {
      uploadFiles(e.dataTransfer.files, activeFileId);
    }
  };

  const onExplorerDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    countRef.current++

    if (!getSelection().length) {
      explorerRef.current.classList.add(style.dragEnter)
    }
  };

  const onExplorerDragLeave = (e) => {
    if (--countRef.current == 0) {
      explorerRef.current.classList.remove(style.dragEnter)
    }
  };

  const onExplorerDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div
      id='explorer'
      ref={explorerRef}
      className={style.explorer}
      onDrop={onExplorerDrop}
      onDragEnter={onExplorerDragEnter}
      onDragLeave={onExplorerDragLeave}
      onDragOver={onExplorerDragOver}
      onClick={clearSelection}
    >
      <ExplorerBar />
      <ExplorerFiles files={activeFileChildren} className={style.explorerFiles} />
    </div>
  );
}
