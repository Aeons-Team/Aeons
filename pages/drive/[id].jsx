import { useBundlrStore } from "../../stores/BundlrStore";
import { useAppState } from "../../stores/AppStore";
import Drive from "../../components/Drive";

function DrivePage() {
  const initialized = useBundlrStore((state) => state.initialized);
  const [ clearSelection ] = useAppState((state) => [state.clearSelection]);
  clearSelection();

  if (initialized) {
    return <Drive />;
  }
}

export default DrivePage;
