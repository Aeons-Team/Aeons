import { useRouter } from "next/router";
import { useAppStore } from "../../stores/AppStore";
import { useBundlrState } from "../../stores/BundlrStore";
import File from "../File";
import style from "./style.module.css";

export default function Explorer() {
  const { id: activeFileId } = useRouter().query;
  const activateContextMenu = useAppStore((state) => state.activateContextMenu);
  const [fileSystem, rerender, render] = useBundlrState((state) => [
    state.fileSystem,
    state.rerender,
    state.render,
  ]);
  const activeFile = fileSystem.hierarchy.getFile(activeFileId);
  const activeFileChildren = activeFile?.getChildren();
  const isFileView = activeFile && activeFile.type == "file"

  const onExplorerDrop = async (e) => {
    e.preventDefault()

    const promises = []

    for (const file of e.dataTransfer.files) {
      promises.push(
        fileSystem.createFile(
          file, 
          activeFileId == "root" ? null : activeFileId
        )
        .then(rerender)
      )
    }

    await Promise.all(promises)
  }

  const onExplorerDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div
      className={isFileView ? style.fileView : style.explorer}
      onContextMenu={(e) => {
        e.preventDefault();
        activateContextMenu(true, {
          type: "explorer",
        });
      }}
      onDrop={onExplorerDrop}
      onDragOver={onExplorerDragOver}
    >
      {
        isFileView
          ? <File file={activeFile} enableControls />
          : <>
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
      }
      </div>
  );
}
