import { useRouter } from "next/router";
import { useState } from "react";
import { useDriveStore } from "../../stores/DriveStore";
import Icon from '../Icon'
import style from "./style.module.css";

export default function Search() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const contractState = useDriveStore((state) => state.contractState);
  const searchFiles = inputValue && contractState.searchFiles(inputValue)

  function SearchQuery(searchItem) {
    if (searchItem.trim() == "") return;

    router.push(`/drive/search/${inputValue}`);
  }

  return (
    <div className={style.search}>
      <div className={`${style.searchInner} ${searchFiles.length ? style.searchInnerCollapse : ''}`}>
        <Icon name='search' />

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
        {searchFiles && searchFiles.map((file) => (
            <div
              key={file.id}
              className={style.listItem}
              onClick={() => router.push(`/drive/${file.id}`)}
            >              
              {
                file.contentType == 'folder'
                  ? <Icon name='folder' width='1.5rem' height='1.5rem' />
                  : <Icon name='file' fill width='1.75rem' height='1.75rem' />
              }

              {file.name}
            </div>
          ))}
      </div>
    </div>
  );
}
