import { useAppContext } from "../../contexts/AppContext";
import Folder from "../Folder";
import File from "../File";
import style from "./style.module.css";
import DrivePreview from "../DrivePreview";

export default function Explorer() {
  const { activateContextMenu, currentFile, currentFileData } = useAppContext();
  const children = currentFileData?.children;

  if (currentFileData && currentFileData.type == "file") {
    return (
      <div className={style.fileView}>
        <File data={currentFileData} enableControls />
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
            type: currentFile == "root" ? "explorer" : "drive",
          });
        }}
      >
        {
          currentFile == 'root'
          ? <div className={style.section}>
            <h1 className={style.sectionTitle}>Drives</h1>
            <div className={style.drives}>
              {children && children
                .map((x) => (
                  <DrivePreview key={x.id} data={x} />
                ))}
            </div>
          </div>

          : <>
            <div className={style.section}>
              <h1 className={style.sectionTitle}>Folders</h1>
              <div className={style.folders}>
                {children && children
                  .filter((x) => x.type == "folder")
                  .map((x) => (
                    <Folder key={x.id} data={x} />
                  ))}
              </div>
            </div>

            <div className={style.section}>
              <h1 className={style.sectionTitle}>Files</h1>
              <div className={style.files}>
                {children && children
                  .filter((x) => x.type == "file")
                  .map((x) => (
                    <File key={x.id} data={x} />
                  ))}
              </div>
            </div>
          </>
        }
      </div>
    </div>
  );
}
