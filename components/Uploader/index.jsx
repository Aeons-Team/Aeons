import { useRouter } from "next/router";
import { useState } from "react";
import { useDriveStore } from "../../stores/DriveStore";
import { useAppState } from "../../stores/AppStore";
import FilePreview from "../FilePreview";
import Button from "../Button";
import style from "./style.module.css";

export default function Uploader() {
  const { id: activeFileId } = useRouter().query;
  const { activateContextMenu } = useAppState((state) => ({ activateContextMenu: state.activateContextMenu }));
  const [
    uploadFiles,
    uploading,
    uploadQueue,
    currentUpload,
    bytesUploaded,
    pauseOrResume,
  ] = useDriveStore((state) => [
    state.uploadFiles,
    state.uploading,
    state.uploadQueue,
    state.currentUpload,
    state.bytesUploaded,
    state.pauseOrResume,
  ]);

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

      {uploading && (
        <div>
          <div>
            <FilePreview
              src={URL.createObjectURL(currentUpload)}
              contentType={currentUpload.type}
              className={style.uploaderPreview}
            />
          </div>
          <button onClick={pauseOrResume}>pause / resume</button>
          {(bytesUploaded / currentUpload.size) * 100}%
          {uploadQueue.map((item) => (
            <div key={item.file.name}>{item.file.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
