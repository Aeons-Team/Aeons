import { useAppContext } from "../../contexts/AppContext";
import { useBundlrContext } from "../../contexts/BundlrContext";
import Folder from "../Folder";
import File from "../File";
import style from "./style.module.css";
import DrivePreview from "../DrivePreview";

export default function Explorer() {
  const { activateContextMenu, currentFile, currentFileData } = useAppContext();
  const { fileSystem } = useBundlrContext();
  const files = fileSystem.hierarchy.getFiles();
  const children = currentFileData?.children;

  if (currentFileData && currentFileData.type == "file") {
    return (
      <div className={style.fileView}>
        <File data={currentFileData} enableControls />
      </div>
    );
  }

  if (currentFile === "root")
    return (
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
          <h1 className={style.sectionTitle}>Drives</h1>
          <div className={style.drives}>
            {files
              .filter((x) => x.type == "drive")
              .map((x) => (
                <DrivePreview key={x.id} data={x} />
              ))}
          </div>
        </div>
      </div>
    );

  return (
    <div>
      <div
        className={style.explorer}
        onContextMenu={(e) => {
          e.preventDefault();
          activateContextMenu(true, {
            type: "drive",
          });
        }}
      >
        <div className={style.section}>
          <h1 className={style.sectionTitle}>Folders</h1>
          <div className={style.folders}>
            {children
              .filter((x) => x.type == "folder")
              .map((x) => (
                <Folder key={x.id} data={x} />
              ))}
          </div>
        </div>

        <div className={style.section}>
          <h1 className={style.sectionTitle}>Files</h1>
          <div className={style.files}>
            {children
              .filter((x) => x.type == "file")
              .map((x) => (
                <File key={x.id} data={x} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
