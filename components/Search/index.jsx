import { useState } from "react";
import { useRouter } from "next/router";
import { useBundlrState } from "../../stores/BundlrStore";
import Button from "../Button";

export default function Search() {
  const [searchItem, setSearchItem] = useState("");
  const router = useRouter();
  const [fileSystem] = useBundlrState((state) => [state.fileSystem]);
  const files = fileSystem.hierarchy.tree.nodes;
  const filesList = {};
  const searchList = [];

  function SearchQuery() {
    if (searchItem == "") return;
    Object.values(files).map((file) => (filesList[file.id] = file.name));
    for (const key in filesList) {
      filesList[key].includes(searchItem) && searchList.push(key);
    }
    setSearchItem("");
    router.push(
      `/drive/search/${searchList.length ? searchList : "NoResults"}`
    );
  }

  return (
    <div>
      <input
        type="text"
        value={searchItem}
        placeholder="Enter file name"
        onInput={(e) => setSearchItem(e.target.value)}
        onKeyUp={(e) => {
          e.key === "Enter" && SearchQuery();
        }}
      />
      <Button onClick={SearchQuery}>Search</Button>
    </div>
  );
}
