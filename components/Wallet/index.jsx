import Funder from '../Funder'
import { useDriveState } from '../../stores/DriveStore'
import style from './style.module.css';

export default function Wallet() {
  const { client, loadedBalance } = useDriveState(state => ({
    client: state.client, 
    loadedBalance: state.loadedBalance
  }));

  return (
    <div className={style.wallet}>
      <div className={style.avatar} />

      <div className={style.walletInner}>
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

        <Funder />
      </div>
    </div>
  );
}