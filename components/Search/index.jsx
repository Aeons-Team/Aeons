import { useState } from "react";
import { useRouter } from "next/router";
import { useBundlrState } from "../../stores/BundlrStore";

export default function Search() {
  const [searchItem, setSearchItem] = useState("");
  const router = useRouter();
  const [fileSystem] = useBundlrState((state) => [state.fileSystem]);
  const files = fileSystem.hierarchy.tree.nodes;
  const filesList = {};
  const search = [];

  function SearchQuery() {
    if (searchItem == "") return;
    Object.values(files).map((file) => (filesList[file.id] = file.name));
    for (let key in filesList) {
      if (filesList[key].includes(searchItem)) {
        search.push(key);
      }
    }
    router.push(`/drive/search/${search.length ? search : "NoResults"}`);
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        onInput={(e) => setSearchItem(e.target.value)}
        onKeyUp={(e) => {
          e.key === "Enter" && SearchQuery();
        }}
      />
    </div>
  );
}
