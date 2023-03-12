import { useRouter } from "next/router";
import { useState } from "react";
import { useBundlrState } from "../../stores/BundlrStore";
import Button from "../Button";
import style from "./style.module.css";
import { useAppStore } from "../../stores/AppStore";

export default function Creator({ type, fileId }) {
  const { id: currentFileId } = useRouter().query;
  const [fileSystem, fetchLoadedBalance, rerender] = useBundlrState((state) => [
    state.fileSystem,
    state.fetchLoadedBalance,
    state.rerender,
  ]);
  const activateContextMenu = useAppStore((state) => state.activateContextMenu);
  const [name, setName] = useState();

  async function onCreate() {
    activateContextMenu(false);
    switch (type) {
      case "Folder":
        await fileSystem.createFolder(
          name,
          currentFileId == "root" ? null : currentFileId
        );
        break;
      case "New":
        await fileSystem.rename(fileId, name);
        break;
      case "Fund":
        if (name && !isNaN(Number(name))) await client.fund(name);
        break;
    }
    rerender();
    await fetchLoadedBalance();
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