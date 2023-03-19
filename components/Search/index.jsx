import { useState } from "react";
import { useRouter } from "next/router";
import { useBundlrState } from "../../stores/BundlrStore";
import Button from "../Button";
import style from "./style.module.css";

export default function Search() {
  const [searchItem, setSearchItem] = useState("");
  const router = useRouter();
  const [fileSystem] = useBundlrState((state) => [state.fileSystem]);
  const files = fileSystem.hierarchy.tree.nodes;
  const filesList = {};
  const searchList = [];

  function SearchQuery() {
    if (searchItem.trim() == "") return;

    Object.values(files).map((file) => (filesList[file.id] = file.name));
    for (const key in filesList) {
      filesList[key].toLowerCase().includes(searchItem.trim().toLowerCase()) &&
        searchList.push(key);
    }
    setSearchItem("");
    router.push(
      `/drive/search/${searchList.length ? searchList : "NoResults"}`
    );
  }

  return (
    <div>
      <div className={style.search}>
        <input
          type="text"
          value={searchItem}
          placeholder="Enter file name"
          onInput={(e) => setSearchItem(e.target.value)}
          onKeyUp={(e) => {
            e.key === "Enter" && SearchQuery();
          }}
        />
      </div>
      <Button onClick={SearchQuery}>Search</Button>
    </div>
  );
}
