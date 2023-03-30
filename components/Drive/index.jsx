import Wallet from "../Wallet";
import Explorer from "../Explorer";
import ContextMenu from "../ContextMenu";
import Search from "../Search";
import SearchExplorer from "../SearchExplorer";
import style from "./style.module.css";
import HomeButton from "../HomeButton";
import ModeButton from "../ModeButton";

export default function Drive({ searchList }) {
  return (
    <div className={style.drive}>
      <ContextMenu />
      <Wallet />
      <div className={style.driveGrid}>
        <div>
          <HomeButton />
          <ModeButton />
          <Search />
        </div>
        {searchList ? <SearchExplorer searchList={searchList} /> : <Explorer />}
      </div>
    </div>
  );
}
