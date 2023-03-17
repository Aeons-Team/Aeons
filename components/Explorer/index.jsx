import { useRouter } from "next/router";
import { useAppState } from "../../stores/AppStore";
import { useBundlrState } from "../../stores/BundlrStore";
import File from "../File";
import style from "./style.module.css";

export default function Explorer() {
  const { id: activeFileId } = useRouter().query;
  const [activateContextMenu, clearSelection] = useAppState((state) => [
    state.activateContextMenu,
    state.clearSelection,
  ]);
  const [fileSystem, uploadFiles, render] = useBundlrState((state) => [
    state.fileSystem,
    state.uploadFiles,
    state.render,
  ]);
  const activeFile = fileSystem.hierarchy.getFile(activeFileId);
  const activeFileChildren = activeFile?.getChildren();
  const isFileView = activeFile && activeFile.type == "file";

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
        <File file={activeFile} enableControls />
      ) : (
        <>
          <div className={style.section}>
            <h1 className={style.sectionTitle}>Folders</h1>
            <div className={style.folders}>
              {activeFileChildren &&
                activeFileChildren
                  .filter((x) => x.type == "folder")
                  .map((x) => <File key={x.id} file={x} />)}
            </div>
          </div>

          <div className={style.section}>
            <h1 className={style.sectionTitle}>Files</h1>
            <div className={style.files}>
              {activeFileChildren &&
                activeFileChildren
                  .filter((x) => x.type == "file")
                  .map((x) => <File key={x.id} file={x} />)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
