import { useBundlrState } from '../../stores/BundlrStore'
import { useState } from "react";
import Button from "../Button";
import style from "./style.module.css";

export default function Funder() {
  const [amount, setAmount] = useState("");
  const [client, fetchLoadedBalance] = useBundlrState(state => [state.client, state.fetchLoadedBalance]);

  async function onFund() {
    if (amount) {
      await client.fund(amount);   
      await fetchLoadedBalance()
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
