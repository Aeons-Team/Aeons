import { useDriveStore } from "../../../stores/DriveStore";
import Drive from "../../../components/Drive";

function SearchPage() {
  const initialized = useDriveStore((state) => state.initialized);
  
  if (initialized) {
    return (
      <Drive searching />
    );
  }
}

export default SearchPage;
