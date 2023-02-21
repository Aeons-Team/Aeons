import { useState, useEffect, useRef } from "react";
import Preview from "../Preview";
import { useBundlrContext } from "../../contexts/BundlrContext";

export default function Uploader() {
  const bundlrClient = useBundlrContext();
  const [uploadFile, setUploadFile] = useState("");
  const [url, setUrl] = useState("");
  const [folderName, setFolderName] = useState("");
  const [lastUploadTx, setLastUploadTx] = useState();

  useEffect(() => {
    if (uploadFile) setUrl(URL.createObjectURL(uploadFile));
  }, [uploadFile]);

  async function onUpload() {

    
    const tx = await bundlrClient.upload(uploadFile);
    setLastUploadTx(tx.id)
  
  }

  async function createFolder() {
    const tx = await bundlrClient.createFolder(folderName);

    console.log(tx);
  }

  return (
    <>

      <label>Create folder : </label>
      <input
        onInput={(e)=> {
            setFolderName(e.target.value)
        }
        }
      />
      
      <button onClick={createFolder}>NEW FOLDER</button>
      

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
    </>
  );
}
