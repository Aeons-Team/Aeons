import Wallet from "../Wallet";
import Explorer from "../Explorer";
import ContextMenu from "../ContextMenu";
import Search from "../Search";
import SearchExplorer from "../SearchExplorer";
import style from "./style.module.css";

export default function Drive({ searchList }) {
  return (
    <div className={style.drive}>
      <ContextMenu />
      <Wallet />
      <div className={style.driveGrid}>
        <Search />
        {searchList ? <SearchExplorer searchList={searchList} /> : <Explorer />}
      </div>
    </div>
  );
}
