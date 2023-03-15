import { useRouter } from "next/router";
import { useAppStore } from "../../stores/AppStore";
import { useBundlrState } from "../../stores/BundlrStore";
import File from "../File";
import style from "./style.module.css";

export default function Explorer() {
  const { id: activeFileId } = useRouter().query;
  const activateContextMenu = useAppStore((state) => state.activateContextMenu);
  const [fileSystem, render] = useBundlrState((state) => [
    state.fileSystem,
    state.render,
  ]);
  const activeFile = fileSystem.hierarchy.getFile(activeFileId);
  const activeFileChildren = activeFile?.getChildren();

  if (activeFile && activeFile.type == "file") {
    return (
      <div className={style.fileView}>
        <File data={activeFile} enableControls />
      </div>
    );
  }

  return (
    <div>
      <div
        className={style.explorer}
        onContextMenu={(e) => {
          e.preventDefault();
          activateContextMenu(true, {
            type: "explorer",
          });
        }}
      >
        <div className={style.section}>
          <h1 className={style.sectionTitle}>Folders</h1>
          <div className={style.folders}>
            {activeFileChildren &&
              activeFileChildren
                .filter((x) => x.type == "folder")
                .map((x) => <File key={x.id} data={x} />)}
          </div>
        </div>

        <div className={style.section}>
          <h1 className={style.sectionTitle}>Files</h1>
          <div className={style.files}>
            {activeFileChildren &&
              activeFileChildren
                .filter((x) => x.type == "file")
                .map((x) => <File key={x.id} data={x} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
