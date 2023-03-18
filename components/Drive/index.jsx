import Wallet from "../Wallet";
import Explorer from "../Explorer";
import ContextMenu from "../ContextMenu";
import Search from "../Search";
import style from "./style.module.css";

export default function Drive() {
  return (
    <div className={style.drive}>
      <ContextMenu />
      <Search />
      <div className={style.driveGrid}>
        <Wallet />
        <Explorer />
      </div>
    </div>
  );
}
