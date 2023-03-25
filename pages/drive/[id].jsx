import { useDriveStore } from "../../stores/DriveStore";
import Drive from "../../components/Drive";

function DrivePage() {
  const initialized = useDriveStore((state) => state.initialized);

  if (initialized) {
    return <Drive />;
  }
}

export default DrivePage;
