import { useRouter } from "next/router";
import { useBundlrStore } from "../../../stores/BundlrStore";
import Drive from "../../../components/Drive";

function SearchPage() {
  const { search } = useRouter().query;
  const searchList = search.split(",");

  const initialized = useBundlrStore((state) => state.initialized);
  if (initialized) {
    return (
      <div>
        <Drive searchList={searchList} />
      </div>
    );
  }
}

export default SearchPage;
