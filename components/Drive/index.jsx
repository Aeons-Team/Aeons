import { useBundlrContext } from "../../contexts/BundlrContext";
import Wallet from '../Wallet'
import Explorer from "../Explorer";
import ContextMenu from "../ContextMenu";
import Hierarchy from '../Hierarchy';
import style from './style.module.css';

export default function Drive() {
  const { initialized } = useBundlrContext();

  if (initialized) {
    return (
      <div className={style.drive}>
        <ContextMenu />

        <div className={style.driveGrid}>
          <Wallet />
          <div />
          <div />
          <Hierarchy />
          <Explorer />
          <div />
        </div>
      </div>
    );
  }
}
