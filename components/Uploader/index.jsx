import { useState } from "react";
import { useBundlrContext } from "../../contexts/BundlrContext";
import FilePreview from "../FilePreview";

export default function Uploader() {
  const { fileSystem, fetchBalance } = useBundlrContext();
  const [uploadFile, setUploadFile] = useState();
  const [url, setUrl] = useState();
  const [folderName, setFolderName] = useState();
  const [lastUploadTx, setLastUploadTx] = useState();

  async function onUpload() {
    const tx = await fileSystem.createFile(uploadFile);
    setLastUploadTx(tx.id);
    await fetchBalance()
  }

  async function createFolder() {
    const tx = await fileSystem.createFolder(folderName);
    await fetchBalance()
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
          const file = e.target.files[0]
          setUploadFile(file);
          setUrl(URL.createObjectURL(file));
        }}
      />

      <button
        onClick={() => {
          uploadFile && onUpload();
        }}
      >
        Upload
      </button>

      {
        url && <FilePreview src={url} type={uploadFile.type} />
      }

      {lastUploadTx}
    </div>
  );
}
