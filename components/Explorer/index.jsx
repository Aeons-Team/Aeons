import { useRouter } from "next/router";
import { useAppStore } from "../../stores/AppStore";
import { useBundlrState } from "../../stores/BundlrStore";
import File from "../File";
import style from "./style.module.css";

export default function Explorer() {
  const { id: currentFileId } = useRouter().query;
  const activateContextMenu = useAppStore((state) => state.activateContextMenu);
  const [fileSystem, render] = useBundlrState((state) => [
    state.fileSystem,
    state.render,
  ]);
  const currentFile = fileSystem.hierarchy.getFile(currentFileId);
  const currentFileChildren = currentFile?.getChildren();

  if (currentFile && currentFile.type == "file") {
    return (
      <div className={style.fileView}>
        <File data={currentFile} enableControls />
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
            {currentFileChildren &&
              currentFileChildren
                .filter((x) => x.type == "folder")
                .map((x) => <File key={x.id} data={x} />)}
          </div>
        </div>

        <div className={style.section}>
          <h1 className={style.sectionTitle}>Files</h1>
          <div className={style.files}>
            {currentFileChildren &&
              currentFileChildren
                .filter((x) => x.type == "file")
                .map((x) => <File key={x.id} data={x} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
