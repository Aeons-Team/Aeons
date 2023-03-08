import { useRouter } from "next/router";
import { useState } from "react";
import { useBundlrState } from "../../stores/BundlrStore";
import Button from "../Button";
import style from "./style.module.css";

export default function FolderCreator() {
  const { id: currentFile } = useRouter().query;
  const [fileSystem, fetchLoadedBalance, rerender] = useBundlrState((state) => [state.fileSystem, state.fetchLoadedBalance, state.currentFile, state.rerender]);
  const [folderName, setFolderName] = useState();

  async function onCreate() {
    await fileSystem.createFolder(
      folderName,
      currentFile == "root" ? null : currentFile
    );
    rerender();
    await fetchLoadedBalance();
  }

  return (
    <div className={style.creator}>
      <label>Folder name: </label>

      <input
        onInput={(e) => {
          setFolderName(e.target.value);
        }}
      />

      <Button onClick={onCreate}>Create Folder</Button>
    </div>
  );
}
