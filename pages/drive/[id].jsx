import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppState } from "../../stores/AppStore";
import DriveLayout from "../../components/DriveLayout";
import Explorer from "../../components/Explorer";

function Page() {
  const { id } = useRouter().query
  const [ clearSelection ] = useAppState((state) => [state.clearSelection]);

  useEffect(() => {
    clearSelection();
  }, [id])

  return (
    <Explorer />
  );
}

Page.layout = (page) => (
  <DriveLayout>
    {page}
  </DriveLayout>
)

export default Page;
