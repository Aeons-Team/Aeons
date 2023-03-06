import { useState } from "react";
import { useBundlrState } from "../../stores/BundlrStore"
import FilePreview from "../FilePreview";
import Button from "../Button";
import style from "./style.module.css";

export default function Uploader() {
  const [fileSystem, fetchBalance, currentFile, refreshCurrentFileData] = useBundlrState(state => [state.fileSystem, state.fetchBalance, state.currentFile, state.refreshCurrentFileData]);
  const [uploadFile, setUploadFile] = useState();
  const [url, setUrl] = useState();
  const [lastUploadTx, setLastUploadTx] = useState();

  async function onUpload() {
    const tx = await fileSystem.createFile(uploadFile, (currentFile == 'root' ? null : currentFile));

    setLastUploadTx(tx.id);
    refreshCurrentFileData();
    await fetchBalance();
  }
  
  return (
    <div className={style.uploader}>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0]
          setUploadFile(file);
          setUrl(URL.createObjectURL(file));
        }}
      />

      <Button
        onClick={() => {
          uploadFile && onUpload();
        }}
      >
        Upload
      </Button>

      {
        url && <FilePreview src={url} type={uploadFile.type} className={style.uploaderPreview} />
      }

      {lastUploadTx}
    </div>
  );
}
