import Wallet from "../Wallet";
import Explorer from "../Explorer";
import ContextMenu from "../ContextMenu";
import Hierarchy from "../Hierarchy";
import Button from "../Button"
import { useBundlrStore } from "../../stores/BundlrStore";
import style from "./style.module.css";

export default function Drive() {
  const fileSystem = useBundlrStore(state => state.fileSystem)

  return (
    <div className={style.drive}>
      <ContextMenu />

      <div className={style.driveGrid}>
        <Wallet />
        <Button
          onClick={async () => {
            const tx = await fileSystem.createUser()
            console.log(tx)
          }}
        >
          Create User
      </Button>
        <div />
        <Hierarchy />
        <Explorer />
        <div />
      </div>
    </div>
  );
}
