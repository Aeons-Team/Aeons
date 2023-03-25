import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDriveStore } from "../../stores/DriveStore";
import { useAppState } from "../../stores/AppStore";
import Drive from "../../components/Drive";

function DrivePage() {
  const { id } = useRouter().query
  const initialized = useDriveStore((state) => state.initialized);
  const [ clearSelection ] = useAppState((state) => [state.clearSelection]);

  useEffect(() => {
    clearSelection();
  }, [id])

  if (initialized) {
    return <Drive />;
  }
}

export default DrivePage;
