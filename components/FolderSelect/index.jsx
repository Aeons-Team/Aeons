import { useState } from "react";
import { useBundlrState } from "../../stores/BundlrStore";
import { useAppState } from "../../stores/AppStore";
import Button from "../Button";
import style from "./style.module.css";

export default function FolderSelect() {
  const [fileSystem, rerender] = useBundlrState((state) => [
    state.fileSystem,
    state.rerender,
  ]);
  const [activateContextMenu, getSelection, clearSelection] = useAppState(
    (state) => [
      state.activateContextMenu,
      state.getSelection,
      state.clearSelection,
    ]
  );
  const [currentFileId, setCurrentFileId] = useState("root");
  const [selectedFileId, setSelectedFileId] = useState("root");
  const currentFile = fileSystem.hierarchy.getFile(currentFileId);
  const selection = getSelection();
  const isMovable = selection.filter(
    (file) => !fileSystem.fileMovableTo(file, selectedFileId)
  ).length;

  async function onMoveButtonClick() {
    activateContextMenu(false);
    await fileSystem.moveFiles(selection, selectedFileId);
    clearSelection();
    rerender();
  }

  return (
    <div>
      {currentFile
        .getChildren()
        .filter((file) => file.type == "folder")
        .map((file) => (
          <div
            key={file.id}
            className={`${style.folder} ${
              file.id == selectedFileId ? style.selected : ""
            }`}
            onClick={() => setSelectedFileId(file.id)}
            onDoubleClick={() => {
              file.getChildren().filter((file) => file.type == "folder")
                .length && setCurrentFileId(file.id);
            }}
          >
            {file.name}
          </div>
        ))}

      <Button
        disabled={currentFile.parent == null}
        onClick={() => setCurrentFileId(currentFile.parent?.id ?? "root")}
      >
        back
      </Button>
      <Button disabled={isMovable} onClick={onMoveButtonClick}>
        move
      </Button>
    </div>
  );
}
