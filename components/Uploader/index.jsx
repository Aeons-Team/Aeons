import { useRouter } from "next/router";
import { useState } from "react";
import { useDriveStore } from "../../stores/DriveStore";
import { useAppStore } from "../../stores/AppStore";
import Button from "../Button";
import style from "./style.module.css";

export default function Uploader() {
  const { id: activeFileId } = useRouter().query;
  const uploadFiles = useDriveStore((state) => state.uploadFiles);
  const activateContextMenu = useAppStore((state) => state.activateContextMenu)

  const [files, setFiles] = useState();

  return (
    <div className={style.uploader}>
      <input
        type="file"
        multiple
        onChange={(e) => {
          setFiles(e.target.files);
        }
      }
      />

      <Button
        onClick={() => {
          activateContextMenu(false);
          uploadFiles(files, activeFileId);
        }}
      >
        Upload
      </Button>
    </div>
  );
}
