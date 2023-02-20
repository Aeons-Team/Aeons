import { useState, useEffect } from "react";
import Preview from "./../Preview";
import { useBundlrContext } from '../../contexts/BundlrContext'

export default function Explorer() {
  const [files, setFiles] = useState()
  const bundlrClient = useBundlrContext()

  useEffect(() => {
    async function fetchFiles() {
      const transactions = await bundlrClient.getTransactions();

      const files = transactions.map(tx => ({ 
        src: `https://arweave.net/${tx.id}`, 
        type: tx.tags.find(tag => tag.name == 'Content-Type')?.value
      }));

      setFiles(files);
    }

    fetchFiles();
  }, [])

  return (
    <>
      {files && files.map((file, i) => (
        <Preview key={i} url={file.src} type={file.type} />
      ))}
    </>
  );
}
