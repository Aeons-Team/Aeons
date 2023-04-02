import { useState } from "react";
import Icon from "../Icon";
import Button from "../Button";
import style from "./style.module.css";
import { useAppState } from "../../stores/AppStore";
import { useDriveState } from '../../stores/DriveStore'

export default function Funder({ onBack }) {
  
  const { activateContextMenu } = useAppState((state) => ({activateContextMenu: state.activateContextMenu}));
  const { client, fetchWalletBalance, fetchLoadedBalance } = useDriveState(state => ({
    client: state.client,
    fetchWalletBalance: state.fetchWalletBalance,
    fetchLoadedBalance: state.fetchLoadedBalance
  }));
  
  const [amount, setAmount] = useState();

  async function onFund() {
    activateContextMenu(false);

    if (amount) {
      await client.fund(amount)

      await Promise.all([
        fetchWalletBalance(),
        fetchLoadedBalance()
      ])
    }
  }

  return (
    <div className={style.funder}>
      <span onClick={onBack}>
        <Icon name='arrow-left' width='1rem' height='1rem' />
      </span>

      Amount:
      <input
        type="number"
        onInput={(e) => {setAmount(e.target.value)}}
        onKeyDown={(e) => { e.key === "Enter" && onFund()}}
      />
      <Button onClick={onFund}>
        Fund
      </Button>
    </div>
  );
}