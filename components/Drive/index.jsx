import { useBundlrContext } from "../../contexts/BundlrContext";
import Explorer from "../Explorer";
import Uploader from "../Uploader";
import Funder from "../Funder";

export default function Drive() {
  const { client } = useBundlrContext();

  if (client) {
    return (
      <>
        <Funder />
        <Uploader />
        <Explorer />
      </>
    );
  }
}
