import { useBundlrContext } from "../../contexts/BundlrContext";
import { useState, useEffect } from "react";

export default function Funder() {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState();
  const { client } = useBundlrContext();

  useEffect(() => {
    async function fetchBalance() {
      const bal = await client.getBalance();
      setBalance(bal);
    }
    fetchBalance();
  }, []);

  return (
    <>
      Balance : {balance} ETH
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      
      <button
        onClick={() => {
          amount && client.fund(amount);
        }}
      >
        Fund
      </button>
    </>
  );
}
