import { useRouter } from "next/router";
import { useAppState } from "../../stores/AppStore";
import { useDriveState } from "../../stores/DriveStore";
import ExplorerBar from '../ExplorerBar'
import ExplorerFiles from "../ExplorerFiles";
import style from "./style.module.css";

export default function Explorer() {
  const { id: activeFileId } = useRouter().query;
  const { clearSelection } = useAppState((state) => ({
    clearSelection: state.clearSelection
  }));
  
  const { contractState, uploadFiles } = useDriveState((state) => ({
    contractState: state.contractState,
    uploadFiles: state.uploadFiles
  }));

  const activeFileChildren = contractState.getChildren(activeFileId);

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

  return (
    <div
      className={style.explorer}
      onDrop={onExplorerDrop}
      onDragOver={onExplorerDragOver}
      onClick={clearSelection}
    >
      <ExplorerBar />
      <ExplorerFiles files={activeFileChildren} />
    </div>
  );
}
