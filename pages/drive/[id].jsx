import { useDriveStore } from "../../stores/DriveStore";
import { useAppState } from "../../stores/AppStore";
import Drive from "../../components/Drive";

function DrivePage() {
  const initialized = useDriveStore((state) => state.initialized);
  const [ clearSelection ] = useAppState((state) => [state.clearSelection]);
  clearSelection();

  if (initialized) {
    return <Drive />;
  }
}

export default DrivePage;
