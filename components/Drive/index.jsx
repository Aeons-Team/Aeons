import Wallet from "../Wallet";
import Explorer from "../Explorer";
import ContextMenu from "../ContextMenu";
import Hierarchy from "../Hierarchy";
import style from "./style.module.css";

export default function Drive() {
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
