import { useRouter } from "next/router";
import { useAppState } from "../../stores/AppStore";
import { useDriveState } from "../../stores/DriveStore";
import File from "../File";
import ExplorerFiles from "../ExplorerFiles";
import style from "./style.module.css";

export default function Explorer() {
  const { id: activeFileId } = useRouter().query;
  const { activateContextMenu, clearSelection } = useAppState((state) => ({
    activateContextMenu: state.activateContextMenu,
    clearSelection: state.clearSelection,
  }));
  
  const { contractState, uploadFiles } = useDriveState((state) => ({
    contractState: state.contractState,
    uploadFiles: state.uploadFiles
  }));

  const activeFile = contractState.getFile(activeFileId);
  const activeFileChildren = contractState.getChildren(activeFileId);
  const isFileView = activeFile.contentType != "folder";

  const onExplorerDrop = async (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      uploadFiles(e.dataTransfer.files, activeFileId);
    }
    clearSelection();
  };

  const onExplorerDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onExplorerContextMenu = (e) => {
    e.preventDefault();
    activateContextMenu(true, {
      type: "explorer",
    });
  };

  return (
    <div
      className={isFileView ? style.fileView : style.explorer}
      onDrop={onExplorerDrop}
      onDragOver={onExplorerDragOver}
      onClick={clearSelection}
      onContextMenu={onExplorerContextMenu}
    >
      {isFileView ? (
        <File file={activeFile} enableControls view />
      ) : (
        <ExplorerFiles files={activeFileChildren} />
      )}
    </div>
  );
}
