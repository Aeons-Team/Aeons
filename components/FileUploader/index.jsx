import { useRouter } from "next/router";
import { useState } from "react";
import { useBundlrState } from "../../stores/BundlrStore"
import FilePreview from "../FilePreview";
import Button from "../Button";
import style from "./style.module.css";

export default function Uploader() {
  const { id: currentFile } = useRouter().query;
  const [fileSystem, fetchLoadedBalance, rerender] = useBundlrState(state => [state.fileSystem, state.fetchLoadedBalance, state.rerender]);
  const [uploadFile, setUploadFile] = useState();
  const [url, setUrl] = useState();
  const [lastUploadTx, setLastUploadTx] = useState();

  async function onUpload() {
    const tx = await fileSystem.createFile(uploadFile, (currentFile == 'root' ? null : currentFile));

    setLastUploadTx(tx.id);
    rerender();
    await fetchLoadedBalance();
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
