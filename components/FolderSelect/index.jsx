import { useRouter } from "next/router";
import { useState } from "react";
import { useDriveState } from "../../stores/DriveStore";
import { useAppState } from "../../stores/AppStore";
import Button from "../Button";
import style from "./style.module.css";

export default function FolderSelect() {
  const { id: activeFileId } = useRouter().query;

  const { contractState, relocateFiles } = useDriveState((state) => ({
    contractState: state.contractState, 
    relocateFiles: state.relocateFiles
  }));
  
  const { activateContextMenu, getSelection, clearSelection } = useAppState((state) => ({
    activateContextMenu: state.activateContextMenu,
    getSelection: state.getSelection,
    clearSelection: state.clearSelection
  }));
  
  const [currentFileId, setCurrentFileId] = useState(activeFileId);
  const [selectedFileId, setSelectedFileId] = useState(activeFileId);
  const currentFile = contractState.getFile(currentFileId);

  const selection = getSelection();
  const isDisabled = selection.filter((file) => !contractState.isRelocatable(file, selectedFileId)).length;

  async function onMoveButtonClick() {
    activateContextMenu(false);
    relocateFiles(selection, activeFileId, selectedFileId);
    clearSelection()
  }

  return (
    <div>
      {contractState
        .getChildren(currentFileId)
        .filter((file) => file.contentType == "folder")
        .map((file) => (
          <div
            key={file.id}
            className={`${style.folder} ${
              file.id == selectedFileId ? style.selected : ""
            }`}
            onClick={() => {
              if (selectedFileId == file.id) {
                setCurrentFileId(file.id)
              }
        
              else {
                setSelectedFileId(file.id)
              }
            }}
          >
            {file.name}
          </div>
        ))}

      <Button
        disabled={currentFile.parentId == null}
        onClick={() => setCurrentFileId(currentFile.parentId ?? "root")}
      >
        back
      </Button>
      <Button disabled={isDisabled} onClick={onMoveButtonClick}>
        move
      </Button>
    </div>
  );
}
