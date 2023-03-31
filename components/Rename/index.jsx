import { useState } from "react";
import Button from "../Button";
import style from "./style.module.css";
import { useAppState } from "../../stores/AppStore";
import { useDriveState } from "../../stores/DriveStore";

export default function Rename() {

  const [name, setName] = useState();
  const { renameFile } = useDriveState((state) => ({renameFile: state.renameFile}));
  const { activateContextMenu, getSelection, clearSelection } = useAppState((state) => ({
    activateContextMenu: state.activateContextMenu,
    getSelection: state.getSelection,
    clearSelection: state.clearSelection,
  }));

  async function onRename() 
  {
    activateContextMenu(false);
    const fileId = getSelection()[0];
    await renameFile(fileId, name);
    clearSelection();
  }

  return (
    <div className={style.rename}>
     Name:
      <input
        type="text"
        onInput={(e) => {setName(e.target.value)}}
        onKeyDown={(e) => { e.key === "Enter" && onRename()}}
      />
      <Button onClick={onRename}>
        Rename
      </Button>
    </div>
  );
}
