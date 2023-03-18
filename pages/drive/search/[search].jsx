import { useRouter } from "next/router";
import { useBundlrStore } from "../../../stores/BundlrStore";
import SearchExplorer from "../../../components/SearchExplorer";

function SearchPage() {
  const { search } = useRouter().query;
  const searchList = search.split(",");

  const initialized = useBundlrStore((state) => state.initialized);
  if (initialized) {
    return (
      <div>
        <SearchExplorer searchList={searchList} />
      </div>
    );
  }
}

export default SearchPage;
