import { useRouter } from "next/router";
import { useDriveStore } from "../../stores/DriveStore";
import style from "./style.module.css";
import { useState } from "react";
import SearchList from "../SearchList";

export default function Search() {
  const router = useRouter();
  const contractState = useDriveStore((state) => state.contractState);
  const files = contractState.getFiles();
  const filesList = {};
  Object.values(files).map((file) => {
    file.id !== "root" && (filesList[file.id] = file.name);
  });
  const [inputValue, setInputValue] = useState("");

  function SearchQuery(searchItem) {
    if (searchItem.trim() == "") return;
    let searchList = [];
    for (const key in filesList) {
      filesList[key].toLowerCase().includes(searchItem.trim().toLowerCase()) &&
        searchList.push(key);
    }
    router.push(
      `/drive/search/${searchList.length ? searchList : "NoResults"}`
    );
  }
  return (
    <div className={style.search}>
      <input
        onInput={(e) => {
          setInputValue(e.target.value);
        }}
        placeholder="Search"
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            SearchQuery(inputValue);
          }
        }}
      />
      <SearchList inputValue={inputValue} />
    </div>
  );
}
