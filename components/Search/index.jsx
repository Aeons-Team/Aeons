import { useRouter } from "next/router";
import style from "./style.module.css";
import { useState } from "react";
import SearchList from "../SearchList";

export default function Search() {
  const router = useRouter();
  
  const [inputValue, setInputValue] = useState("");

  function SearchQuery(searchItem) {
    if (searchItem.trim() == "") return;

    router.push(`/drive/search/${inputValue}`);
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
