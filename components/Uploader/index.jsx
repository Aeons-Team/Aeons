import { useState, useEffect, useRef } from "react";
import Preview from '../Preview'
import BundlrClient from '../../lib/BundlrClient'

export default function Uploader() {
  const [uploadFile, setUploadFile] = useState("");
  const [url, setUrl] = useState("");
  const bundlrClientRef = useRef()

  useEffect(() => {
    async function initialize() {
      const bundlrClient = new BundlrClient()
      await bundlrClient.initialize()

      bundlrClientRef.current = bundlrClient
    }

    initialize()
  }, [])

  useEffect(() => {
    if (uploadFile) setUrl(URL.createObjectURL(uploadFile));
  }, [uploadFile]);

  async function onUpload() {
    const bundlrClient = bundlrClientRef.current 
    await bundlrClient.upload(uploadFile) 
  }

  return (
    <>
      <input
          type="file"
          onChange={(e) => {
            setUploadFile(e.target.files[0]);
          }} />
      
      <button onClick={onUpload}>Upload</button>

      <Preview url={url} type={uploadFile?.type} />
    </>
  );
}
