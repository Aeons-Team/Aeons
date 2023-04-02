import ContextMenu from "../ContextMenu";
import Topbar from '../Topbar';
import Sidebar from '../Sidebar';
import ExplorerBar from "../ExplorerBar";
import UploadQueue from "../UploadQueue"
import style from "./style.module.css";

export default function Drive({ children }) {
  return (
    <div className={style.drive}>
      <Topbar />
      <ExplorerBar />
      <Sidebar />
      {children}
      <ContextMenu />
      <UploadQueue />
    </div>
  );
}
