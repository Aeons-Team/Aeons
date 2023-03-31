import Wallet from "../Wallet";
import ContextMenu from "../ContextMenu";
import Search from "../Search";
import style from "./style.module.css";
import HomeButton from "../HomeButton";
import ModeButton from "../ModeButton";

export default function Drive({ children }) {
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
          {children}
      </div>
    </div>
  );
}
