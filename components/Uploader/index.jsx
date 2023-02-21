import { useState, useEffect, useRef } from "react";
import Preview from "../Preview";
import { useBundlrContext } from "../../contexts/BundlrContext";

export default function Uploader() {
  const { fileSystem } = useBundlrContext();
  const [uploadFile, setUploadFile] = useState("");
  const [url, setUrl] = useState("");
  const [folderName, setFolderName] = useState("");
  const [lastUploadTx, setLastUploadTx] = useState();

  useEffect(() => {
    if (uploadFile) setUrl(URL.createObjectURL(uploadFile));
  }, [uploadFile]);

  async function onUpload() {
    const tx = await fileSystem.createFile(uploadFile);
    setLastUploadTx(tx.id);
  }

  async function createFolder() {
    const tx = await fileSystem.createFolder(folderName);
    console.log(tx);
  }

  return (
    <div>
      <input
        onInput={(e) => {
          setFolderName(e.target.value);
        }}
      />

      <button onClick={createFolder}>Create Folder</button>

      <input
        type="file"
        onChange={(e) => {
          setUploadFile(e.target.files[0]);
        }}
      />

      <button
        onClick={() => {
          uploadFile && onUpload();
        }}
      >
        Upload
      </button>

      <Preview url={url} type={uploadFile?.type} />

      {lastUploadTx}
    </div>
  );
}
