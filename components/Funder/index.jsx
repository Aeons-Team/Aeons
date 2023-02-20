import { useBundlrContext } from "../../contexts/BundlrContext";
import { useState, useEffect } from "react";

export default function Funder() {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState();
  const bundlrClient = useBundlrContext();

  useEffect(() => {
    async function fetchBalance() {
      const bal = await bundlrClient.getBalance();
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
      ></input>
      <button
        onClick={() => {
          amount && bundlrClient.fund(amount);
        }}
      >
        Fund
      </button>
    </>
  );
}
