import { useRouter } from "next/router";
import { useAppStore } from "../../stores/AppStore";
import { useDriveStore } from "../../stores/DriveStore";
import File from "../File";
import style from "./style.module.css";

export default function SearchExplorer() {
  const { search } = useRouter().query
  const clearSelection = useAppStore((state) => state.clearSelection);
  const contractState = useDriveStore((state) => state.contractState);

  const searchItems = contractState.searchFiles(search)

  if (searchItems.length == 0)
    return (
      <div className={style.sectionTitle}>
        <h1>No Results Found</h1>
      </div>
    );

  return (
    <div className={style.explorer} onClick={() => clearSelection()}>
      <div className={style.section}>
        <h1 className={style.sectionTitle}>Folders</h1>
        <div className={style.folders}>
          {searchItems
            .filter((x) => x.contentType == "folder")
            .map((x) => (
              <File key={x.id} file={x} />
            ))}
        </div>
      </div>
      <div className={style.section}>
        <h1 className={style.sectionTitle}>Files</h1>
        <div className={style.folders}>
          {searchItems
            .filter((x) => x.contentType != "folder")
            .map((x) => (
              <File key={x.id} file={x} />
            ))}
        </div>
      </div>
    </div>
  );
}
