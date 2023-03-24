import { useRouter } from "next/router";
import { useState } from "react";
import { useBundlrState } from "../../stores/BundlrStore";
import Button from "../Button";
import style from "./style.module.css";
import { useAppState } from "../../stores/AppStore";

export default function Creator({ type }) {
  const { id: activeFileId } = useRouter().query;
  const [fileSystem, rerender] = useBundlrState((state) => [
    state.fileSystem,
    state.rerender,
  ]);
  const [activateContextMenu, getSelection, clearSelection] = useAppState(
    (state) => [
      state.activateContextMenu,
      state.getSelection,
      state.clearSelection,
    ]
  );
  const [name, setName] = useState();

  async function onCreate() {
    activateContextMenu(false);
    switch (type) {
      case "Folder":
        await fileSystem.createFolder(
          name,
          activeFileId == "root" ? null : activeFileId
        );
        break;
      case "New":
        const fileId = getSelection()[0];
        await fileSystem.rename(fileId, name);
        clearSelection();
        break;
      case "Fund":
        if (name && !isNaN(Number(name))) await client.fund(name);
        break;
    }

    rerender();
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
