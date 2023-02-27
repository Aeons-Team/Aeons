import { useState } from "react";
import { useBundlrContext } from "../../contexts/BundlrContext";
import { useAppContext } from "../../contexts/AppContext";
import Button from "../Button";
import style from "./style.module.css";

export default function DriveCreator() {
  const { refreshCurrentFileData } = useAppContext()
  const { fileSystem, fetchBalance } = useBundlrContext();
  const [driveName, setDriveName] = useState();

  async function onCreate() {
    await fileSystem.createDrive(driveName);
    refreshCurrentFileData();
    await fetchBalance();
  }

  return (
    <div className={style.creator}>
      <label>Drive name: </label>

      <input
        onInput={(e) => {
          setDriveName(e.target.value);
        }}
      />

      <Button onClick={onCreate}>Create Drive</Button>
    </div>
  );
}
