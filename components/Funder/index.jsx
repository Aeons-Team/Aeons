import { useBundlrContext } from "../../contexts/BundlrContext";
import { useState } from "react";

export default function Funder() {
  const [amount, setAmount] = useState("");
  const { client, balance, fetchBalance } = useBundlrContext();

  async function onFund() {
    if (amount) {
      await client.fund(amount);   
      await fetchBalance()
    }
  }

  return (
    <div>
      Balance : {balance} ETH
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      
      <button
        onClick={onFund}
      >
        Fund
      </button>
    </div>
  );
}
