import { useState } from "react";
import { useBundlrState } from '../../stores/BundlrStore'
import Button from "../Button";
import style from "./style.module.css"

export default function FolderCreator() {
  const [fileSystem, fetchBalance, currentFile, refreshCurrentFileData] = useBundlrState(state => [state.fileSystem, state.fetchBalance, state.currentFile, state.refreshCurrentFileData]);
  const [folderName, setFolderName] = useState();

  async function onCreate() {
    await fileSystem.createFolder(folderName, (currentFile == 'root' ? null : currentFile));
    refreshCurrentFileData()
    await fetchBalance()
  }

  return (
    <div className={style.creator}>
      <label>File name: </label>

      <input
        onInput={(e) => {
          setFolderName(e.target.value);
        }}
      />

      <Button onClick={onCreate}>Create Folder</Button>
    </div>
  )
}