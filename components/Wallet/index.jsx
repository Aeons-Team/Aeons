import { useBundlrContext } from "../../contexts/BundlrContext";
import style from './style.module.css';

export default function Wallet() {
  const { client, balance } = useBundlrContext();

  return (
    <div className={style.wallet}>
      <div className={style.walletSegment}>
        <span>Wallet</span>
        {client.address.substring(0, 6) + '...' + client.address.substring(client.address.length - 3)}
      </div>

      <div className={style.walletSegment}>
        <span>Network</span>
        {client.network.name}
      </div>

      <div className={style.walletSegment}>
        <span>Balance</span>
        {Number(balance).toFixed(6)}
      </div>
    </div>
  );
}