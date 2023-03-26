import { useRouter } from "next/router";
import { useState } from "react";
import { useDriveState } from "../../stores/DriveStore";
import Button from "../Button";
import style from "./style.module.css";
import { useAppState } from "../../stores/AppStore";

export default function FolderCreator() {
  
  const { id: activeFileId } = useRouter().query;
  const { createFolder } = useDriveState((state) => ({createFolder: state.createFolder}));
  const { activateContextMenu } = useAppState((state) => ({activateContextMenu: state.activateContextMenu}));
  const [name, setName] = useState();

  async function onFolderCreate() {
    activateContextMenu(false);
    await createFolder(name, activeFileId)
  }

  return (
    <div className={style.folderCreator}>
      Folder name:
      <input
        type="text"
        onInput={(e) => {setName(e.target.value)}}
      />
      <Button onClick={onFolderCreate}>
        Create Folder
      </Button>
    </div>
  );
}
