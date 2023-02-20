import { useState, useEffect, useRef } from "react";
import Preview from "../Preview";
import { useBundlrContext } from "../../contexts/BundlrContext";

export default function Uploader() {
  const bundlrClient = useBundlrContext();
  const [uploadFile, setUploadFile] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (uploadFile) setUrl(URL.createObjectURL(uploadFile));
  }, [uploadFile]);

  async function onUpload() {
    await bundlrClient.upload(uploadFile);
  }

  return (
    <>
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
    </>
  );
}
