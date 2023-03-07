import { useBundlrState } from '../../stores/BundlrStore'
import style from './style.module.css';

export default function Wallet() {
  const [client, loadedBalance] = useBundlrState(state => [state.client, state.loadedBalance]);

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
        <span>Loaded Balance</span>
        {Number(loadedBalance).toFixed(6)}
      </div>

      <div className={style.walletSegment}>
        <span>Balance</span>
        {Number(client.walletBalance).toFixed(6)}
      </div>
    </div>
  );
}