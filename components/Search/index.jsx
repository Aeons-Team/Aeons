import { useRouter } from "next/router";
import { useBundlrState } from "../../stores/BundlrStore";
import style from "./style.module.css";
import Select from "react-select";
import { useState } from "react";

export default function Search() {
  const router = useRouter();
  const [fileSystem] = useBundlrState((state) => [state.fileSystem]);
  const files = fileSystem.hierarchy.tree.nodes;
  const filesList = {};
  Object.values(files).map((file) => {
    file.id !== "root" && (filesList[file.id] = file.name);
  });
  const [inputValue, setInputValue] = useState("");
  let executed = false;

  const filterOptions = (inputValue) => {
    let searchList = [];

    for (const [id, name] of Object.entries(filesList)) {
      name.toLowerCase().includes(inputValue.trim().toLowerCase()) &&
        searchList.push({ key: name, value: id, label: name });
    }
    return searchList;
  };

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
      <Select
        onInputChange={(e) => {
          setInputValue(e);
        }}
        value={null}
        defaultMenuIsOpen={false}
        options={filterOptions(inputValue)}
        noOptionsMessage={() => null}
        blurInputOnSelect={true}
        menuIsOpen={inputValue}
        placeholder="Search"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            executed = true;
            SearchQuery(inputValue);
          }
        }}
        onChange={(e) => {
          !executed && router.push(`/drive/search/${e.value}`);
        }}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
          LoadingIndicator: () => null,
        }}
      />
    </div>
  );
}
