import { useRouter } from "next/router";
import { useState } from "react";
import { useDriveState } from "../../stores/DriveStore";
import { useAppState } from "../../stores/AppStore";
import Button from "../Button";
import style from "./style.module.css";

export default function FolderSelect() {
  const { id: activeFileId } = useRouter().query;
  
  const [contractState, relocateFiles] = useDriveState((state) => [state.contractState, state.relocateFiles]);
  const [activateContextMenu, getSelection, clearSelection] = useAppState(
    (state) => [
      state.activateContextMenu,
      state.getSelection,
      state.clearSelection,
    ]
  );
  const [currentFileId, setCurrentFileId] = useState("root");
  const [selectedFileId, setSelectedFileId] = useState("root");
  const currentFile = contractState.getFile(currentFileId);
  const selection = getSelection();
  const isMovable = selection.filter(
    (file) => !contractState.isRelocatable(file, selectedFileId)
  ).length;

  async function onMoveButtonClick() {
    activateContextMenu(false);
    await relocateFiles(selection, activeFileId, selectedFileId);
    clearSelection();
  }

  return (
    <div>
      {contractState
        .getChildren(currentFileId)
        .filter((file) => file.content_type == "folder")
        .map((file) => (
          <div
            key={file.id}
            className={`${style.folder} ${
              file.id == selectedFileId ? style.selected : ""
            }`}
            onClick={() => setSelectedFileId(file.id)}
            onDoubleClick={() => {
              contractState.getChildren(file.id).filter((file) => file.content_type == "folder")
                .length && setCurrentFileId(file.id);
            }}
          >
            {file.name}
          </div>
        ))}

      <Button
        disabled={currentFile.parent_id == null}
        onClick={() => setCurrentFileId(currentFile.parent_id ?? "root")}
      >
        back
      </Button>
      <Button disabled={isMovable} onClick={onMoveButtonClick}>
        move
      </Button>
    </div>
  );
}
