import { useBundlrContext } from "../../contexts/BundlrContext";
import Explorer from "../Explorer";
import Uploader from "../Uploader";
import Funder from "../Funder";

export default function Drive() {
  const bundlrClient = useBundlrContext();

  if (bundlrClient) {
    return (
      <>
        <Funder />
        <Uploader />
        <Explorer />
      </>
    );
  }
}
