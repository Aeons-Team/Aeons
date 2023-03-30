import { useRouter } from "next/router";
import { useState } from "react";
import { useDriveStore } from "../../stores/DriveStore";
import style from "./style.module.css";

export default function Search() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const contractState = useDriveStore((state) => state.contractState);

  function SearchQuery(searchItem) {
    if (searchItem.trim() == "") return;

    router.push(`/drive/search/${inputValue}`);
  }

  return (
    <div className={style.search}>
      <div className={style.searchInner}>
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M26.6667 26.6667L21.0711 21.0711C21.0711 21.0711 18.6667 24 14 24C8.47715 24 4 19.5228 4 14C4 8.47715 8.47715 4 14 4C19.5228 4 24 8.47715 24 14C24 14.6849 23.9312 15.3537 23.8 16" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

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
      </div>

      <div className={style.list}>
        {inputValue &&
          contractState.searchFiles(inputValue).map((file) => (
            <div
              key={file.id}
              onClick={() => router.push(`/drive/${file.id}`)}
            >
              {file.name}
            </div>
          ))}
      </div>
    </div>
  );
}
