import { useRouter } from "next/router";
import { useState } from "react";
import { useBundlrState } from "../../stores/BundlrStore";
import FilePreview from "../FilePreview";
import Button from "../Button";
import style from "./style.module.css";

export default function Uploader() {
  const { id: currentFileId } = useRouter().query;
  const [fileSystem, fetchLoadedBalance, rerender] = useBundlrState((state) => [
    state.fileSystem,
    state.fetchLoadedBalance,
    state.rerender,
  ]);
  const [uploadFile, setUploadFile] = useState();
  const [fileName, setFileName] = useState();
  const [url, setUrl] = useState();
  const [lastUploadTx, setLastUploadTx] = useState();

  async function onUpload() {
    const tx = await fileSystem.createFile(
      uploadFile,
      currentFileId == "root" ? null : currentFileId,
      fileName ?? uploadFile.name
    );

    setLastUploadTx(tx.id);
    rerender();
    await fetchLoadedBalance();
  }

  return (
    <div className={style.uploader}>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          setUploadFile(file);
          setUrl(URL.createObjectURL(file));
        }}
      />
      <input
        type="text"
        placeholder="File Name"
        onChange={(e) => {
          setFileName(e.target.value);
        }}
      />
      <Button
        onClick={() => {
          uploadFile && onUpload();
        }}
      >
        Upload
      </Button>

      {url && (
        <FilePreview
          src={url}
          type={uploadFile.type}
          className={style.uploaderPreview}
        />
      )}

      {lastUploadTx}
    </div>
  );
}
