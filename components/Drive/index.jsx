import Wallet from "../Wallet";
import Explorer from "../Explorer";
import ContextMenu from "../ContextMenu";
import style from "./style.module.css";

export default function Drive() {
  return (
    <div className={style.drive}>
      <ContextMenu />

      <div className={style.driveGrid}>
        <Wallet />
        <Explorer />
      </div>
    </div>
  );
}
