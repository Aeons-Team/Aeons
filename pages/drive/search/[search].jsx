import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppState } from "../../../stores/AppStore";
import DriveLayout from "../../../components/DriveLayout";
import SearchExplorer from "../../../components/SearchExplorer";

function Page() {
  const { id } = useRouter().query
  const [ clearSelection ] = useAppState((state) => [state.clearSelection]);

  useEffect(() => {
    clearSelection();
  }, [id])

  return (
    <SearchExplorer />
  )
}

Page.layout = (page) => (
  <DriveLayout>
    {page}
  </DriveLayout>
)

export default Page;
