import { useState } from "react";
import { useBundlrContext } from "../../contexts/BundlrContext";
import Button from "../Button";
import style from "./style.module.css"

export default function FolderCreator() {
  const { fileSystem } = useBundlrContext();
  const [folderName, setFolderName] = useState();

  async function onCreate() {
    await fileSystem.createFolder(folderName);
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