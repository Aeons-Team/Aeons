import Wallet from "../Wallet";
import Explorer from "../Explorer";
import ContextMenu from "../ContextMenu";
import Search from "../Search";
import SearchExplorer from "../SearchExplorer";
import style from "./style.module.css";
import HomeButton from "../HomeButton";

export default function Drive({ searching }) {
  return (
    <div className={style.drive}>
      <ContextMenu />
      <Wallet />
      <div className={style.driveGrid}>
        <div>
          <HomeButton />
          <Search />
        </div>
        {searching ? <SearchExplorer /> : <Explorer />}
      </div>
    </div>
  );
}
