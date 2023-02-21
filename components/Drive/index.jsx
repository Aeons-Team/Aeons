import { useBundlrContext } from "../../contexts/BundlrContext";
import Explorer from "../Explorer";
import Uploader from "../Uploader";
import Funder from "../Funder";
import style from './style.module.css'

export default function Drive() {
  const { client } = useBundlrContext();

  if (client) {
    return (
      <div className={style.drive}>
        <Funder />
        <Uploader />
        <Explorer />
      </div>
    );
  }
}
