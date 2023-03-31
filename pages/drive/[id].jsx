import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppState } from "../../stores/AppStore";
import Explorer from "../../components/Explorer";

function Page() {
  const { id } = useRouter().query
  const [ clearSelection ] = useAppState((state) => [state.clearSelection]);

  useEffect(() => {
    clearSelection();
  }, [id])

  return <Explorer />;
}

export default Page;
