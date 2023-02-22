import { useBundlrContext } from "../../contexts/BundlrContext";
import { useState } from "react";
import Button from "../Button";
import style from "./style.module.css";

export default function Funder() {
  const [amount, setAmount] = useState("");
  const { client, fetchBalance } = useBundlrContext();

  async function onFund() {
    if (amount) {
      await client.fund(amount);   
      await fetchBalance()
    }
  }

  return (
    <div className={style.funder}>
      <label>amount: </label>
      
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      
      <Button
        onClick={onFund}
      >
        Fund
      </Button>
    </div>
  );
}
