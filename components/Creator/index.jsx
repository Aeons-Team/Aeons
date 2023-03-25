import { useRouter } from "next/router";
import { useState } from "react";
import { useDriveState } from "../../stores/DriveStore";
import Button from "../Button";
import style from "./style.module.css";
import { useAppState } from "../../stores/AppStore";

export default function Creator({ type }) {
  const { id: activeFileId } = useRouter().query;

  const { createFolder, renameFile } = useDriveState((state) => ({
    createFolder: state.createFolder, 
    renameFile: state.renameFile
  }));

  const { activateContextMenu, getSelection, clearSelection } = useAppState((state) => ({
    activateContextMenu: state.activateContextMenu,
    getSelection: state.getSelection,
    clearSelection: state.clearSelection,
  }));

  const [name, setName] = useState();

  async function onCreate() {
    activateContextMenu(false);
    switch (type) {
      case "Folder":
        await createFolder(name, activeFileId)
        break;
      
      case "New":
        const fileId = getSelection()[0];
        await renameFile(fileId, name)
        clearSelection();

        break;
      
      case "Fund":
        if (name && !isNaN(Number(name))) await client.fund(name);
        break;
    }
  }
  return (
    <div className={style.creator}>
      {type === "Fund" ? <label>Amount: </label> : <label>{type} name: </label>}
      <input
        type="text"
        onInput={(e) => {
          setName(e.target.value);
        }}
      />
      <Button onClick={onCreate}>
        {type === "New" ? `Rename` : `Create ${type}`}
      </Button>
    </div>
  );
}
