import { useRouter } from "next/router";
import { useAppStore } from "../../stores/AppStore";
import { useDriveStore } from "../../stores/DriveStore";
import ExplorerFiles from '../ExplorerFiles'
import style from "./style.module.css";

export default function SearchExplorer() {
  const { search } = useRouter().query
  const clearSelection = useAppStore((state) => state.clearSelection);
  const contractState = useDriveStore((state) => state.contractState);

  const searchItems = contractState.searchFiles(search)

  if (searchItems.length == 0)
    return (
      <div className={style.noResults}>
        No results found
      </div>
    );

  return (
    <div className={style.searchExplorer} onClick={() => clearSelection()}>
      <ExplorerFiles files={searchItems} className={style.explorerFiles} />
    </div>
  );
}
