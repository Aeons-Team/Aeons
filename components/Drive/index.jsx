import ContextMenu from "../ContextMenu";
import Topbar from '../Topbar';
import Sidebar from '../Sidebar';
import Ancestors from "../Ancestors";
import UploadQueue from "../UploadQueue"
import style from "./style.module.css";

export default function Drive({ children }) {
  return (
    <div className={style.drive}>
      <Topbar />
      <Ancestors />
      <Sidebar />
      {children}
      <ContextMenu />
      <UploadQueue />
    </div>
  );
}
