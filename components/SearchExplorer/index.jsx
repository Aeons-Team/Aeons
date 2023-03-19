import { useAppState } from "../../stores/AppStore";
import { useBundlrState } from "../../stores/BundlrStore";
import File from "../File";
import style from "./style.module.css";

export default function SearchExplorer({ searchList }) {
  const [clearSelection] = useAppState((state) => [state.clearSelection]);
  const [fileSystem] = useBundlrState((state) => [state.fileSystem]);

  let searchItems = {};
  searchList.map((x) => {
    searchItems[x] = fileSystem.hierarchy.getFile(x);
  });

  if (searchList == "NoResults")
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
          {Object.values(searchItems)
            .filter((x) => x.type == "folder")
            .map((x) => (
              <File key={x.id} file={x} />
            ))}
        </div>
      </div>
      <div className={style.section}>
        <h1 className={style.sectionTitle}>Files</h1>
        <div className={style.folders}>
          {Object.values(searchItems)
            .filter((x) => x.type == "file")
            .map((x) => (
              <File key={x.id} file={x} />
            ))}
        </div>
      </div>
    </div>
  );
}
