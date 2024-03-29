import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { useDriveStore, useDriveState } from "../../stores/DriveStore";
import { useAppStore } from "../../stores/AppStore";
import { motion } from "framer-motion";
import Crypto from "../../lib/Crypto";
import Icon from '../Icon'
import style from "./style.module.css";

export default function Search() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const contractState = useDriveStore((state) => state.contractState);
  const searchActivated = useAppStore((state) => state.searchActivated)
  const contract = useDriveState((state) => state.contract)
  const searchRef = useRef()

  const searchFiles = inputValue && contractState.searchFiles(inputValue)
  const isSearching = searchActivated && searchFiles && searchFiles.length > 0

  function SearchQuery(searchItem) {
    if (searchItem.trim() == "") return;

    router.push(`/drive/search/${inputValue}`);
  }

  useEffect(() => {
    const onClick = (e) => {
      if (!searchRef.current.contains(e.target) && useAppStore.getState().searchActivated) {
        useAppStore.setState({ searchActivated: false })
      }
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div ref={searchRef} className={style.search}>
      <motion.div 
        className={`${style.searchInner} 
        ${isSearching ? style.searchInnerCollapse : ''}`}
        animate={{  
          backgroundColor: searchActivated ? 'var(--color-primary-2)' : 'var(--color-primary)'
        }}
      >
        <span>
          <Icon 
            name='search' 
            width='1.6rem'
            height='1.6rem'
            animate={{
              opacity: searchActivated ? 1 : 0.5,
              stroke: searchActivated ? 'var(--color-active)' : 'var(--color-secondary)'
            }}
            transition={{
              duration: 0.2,
              ease: 'easeInOut'
            }}
          />
        </span>
        
        <input
          onInput={(e) => {
            setInputValue(e.target.value);
          }}
          value={inputValue}
          onFocus={() => useAppStore.setState({ searchActivated: true })}
          placeholder="Search"
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              SearchQuery(inputValue);
            }
          }}
        />
      </motion.div>

      <div className={style.list}>
        <div className={style.listInner}>
          {isSearching && searchFiles.map((file) => (
              <div
                key={file.id}
                className={style.listItem}
                onClick={async () => {
                  useAppStore.setState({ searchActivated: false })
                  setInputValue("")

                  if (file.contentType == 'folder') {
                    router.push(`/drive/${file.id}`)
                  }
                  else if (file.encryption) {
                    const decryptedUrl = await Crypto.decryptedFileUrl(file.id, file.encryption, contract.internalWallet.privateKey, file.contentType)
                    window.open(decryptedUrl)
                  }
                  else {
                    window.open(`${process.env.NEXT_PUBLIC_ARWEAVE_URL}/${file.id}`)
                  }
                }}
              >      
                <span>
                  {
                    file.contentType == 'folder'
                      ? <Icon name='folder' width='1.1rem' height='1.1rem' fill />
                      : <Icon name='file' fill width='1.25rem' height='1.25rem' />
                  }
                </span>        

                <span>
                  {file.name}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
