import { useRouter } from "next/router";
import { useState, useRef } from "react";
import Icon from '../Icon'
import IconButton from '../IconButton'
import { useDriveState } from "../../stores/DriveStore";
import Ancestors from '../Ancestors'
import Button from "../Button";
import style from "./style.module.css";

export default function FolderSelect({ disabled = () => false, onClick, onBack } = {}) {
  const { id: activeFileId } = useRouter().query;

  const { contractState } = useDriveState((state) => ({
    contractState: state.contractState
  }));

  const [currentFileId, setCurrentFileId] = useState(activeFileId);
  const [selectedFileId, setSelectedFileId] = useState(activeFileId);
  const currentFile = contractState.getFile(currentFileId);

  const [loading, setLoading] = useState(false);
  const loadingRef = useRef()

  const onSelectClick = async () => {
    if (loadingRef.current) return

    loadingRef.current = true 
    setLoading(true)
    await onClick(selectedFileId)
    setLoading(false)
  }

  return (
    <div className={style.folderSelect}>
      <div className={style.currentFileHeader}>
        <IconButton 
          name='arrow-left'
          disabled={currentFile.id == 'root'}
          onClick={() => {
            setCurrentFileId(currentFile.parentId)
            setSelectedFileId(currentFile.parentId)
          }}
        />
      </div>

      <div className={style.folders}>
        {
          contractState
            .getChildren(currentFileId)
            .filter((file) => file.contentType == "folder")
            .map((file) => (
              <div
                key={file.id}
                className={`${style.folder} ${
                  file.id == selectedFileId ? style.selected : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation()

                  if (selectedFileId == file.id) {
                    setCurrentFileId(file.id)
                  }
            
                  else {
                    setSelectedFileId(file.id)
                  }
                }}
              >
                <Icon name='folder' width='1rem' height='1rem' fill />

                <span className={style.folderName}>{file.name}</span>
              </div>
            ))
          }
      </div>

      <div>
        <Ancestors 
          id={currentFileId} 
          onClick={(file) => {
            setCurrentFileId(file.id)
            setSelectedFileId(file.id)
          }}
          iconSize='0.5rem'
          itemStyle={{
            padding: '0.25rem 0.5rem',
            minWidth: '2rem',
            maxWidth: '5rem'
          }}
        />
      </div>

      <div className={style.lower}>
        <button   
          className={style.back} 
          disabled={loading}
          onClick={onBack}
        >
          Back
        </button>

        <Button disabled={() => disabled(selectedFileId)} onClick={onSelectClick} loading={loading}>
          Select
        </Button>
      </div>
    </div>
  );
}
