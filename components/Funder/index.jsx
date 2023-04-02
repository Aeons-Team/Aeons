import { useState } from "react";
import Button from "../Button";
import style from "./style.module.css";
import { useAppState } from "../../stores/AppStore";
import { useDriveState } from '../../stores/DriveStore'
import IconButton from "../IconButton";
import Input from "../Input";

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
      <span >
        <IconButton name='arrow-left' onClick={onBack}/>
        Amount:
      </span>
      <Input
        type="number"
        onInput={(e) => {setAmount(e.target.value)}}
        onKeyDown={(e) => { e.key === "Enter" && onFund()}}
        placeholder="0.00"
      />
      <Button onClick={onFund}>
        Fund
      </Button>
    </div>
  );
}