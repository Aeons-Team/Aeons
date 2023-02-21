import { useState, useEffect } from "react";
import Preview from "./../Preview";
import { useBundlrContext } from '../../contexts/BundlrContext'

export default function Explorer() {
  const [transactions, setTransactions] = useState()
  const { fileSystem } = useBundlrContext()

  useEffect(() => {
    async function fetchTransactions() {
      let transactions = await fileSystem.getTransactions();
      
      transactions = transactions.map(tx => ({ 
        src: `https://arweave.net/${tx.id}`, 
        name: tx.tags.find(tag => tag.name == 'name')?.value,
        type: tx.tags.find(tag => tag.name == 'type')?.value,
        contentType: tx.tags.find(tag => tag.name == 'Content-Type')?.value
      }));

      setTransactions(transactions);
    }

    fetchTransactions();
  }, [])

  return (
    <>
      {transactions && transactions.map((tx, i) => (
        <Preview key={i} {...tx} />
      ))}
    </>
  );
}
