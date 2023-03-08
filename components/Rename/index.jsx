import { useState } from "react";
import { useBundlrState } from "../../stores/BundlrStore";
import Button from "../Button";
import style from "./style.module.css";

export default function Rename({ fileId }) {
  const [fileSystem, rerender] = useBundlrState((state) => [
    state.fileSystem,
    state.rerender,
  ]);
  const [newName, setNewName] = useState();

  async function onRename() {
    await fileSystem.rename(fileId, newName);
    rerender();
  }

  return (
    <div className={style.creator}>
      <label>New Name: </label>

      <input
        onInput={(e) => {
          setNewName(e.target.value);
        }}
      />

      <Button onClick={onRename}>Rename</Button>
    </div>
  );
}
