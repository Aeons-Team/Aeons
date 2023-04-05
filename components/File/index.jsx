import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useAppState, useAppStore } from "../../stores/AppStore";
import { useDriveState } from "../../stores/DriveStore";
import FileInfo from "../FileInfo";
import FolderInfo from "../FolderInfo";
import style from "./style.module.css";

export default function File({ file, enableControls }) {
  const router = useRouter();
  const { id: activeFileId } = router.query;
  
  const { activateContextMenu, selected, select, getSelection, clearSelection, selectItems } = useAppState((state) => ({
    activateContextMenu: state.activateContextMenu,
    selected: state.selected[file.id],
    select: state.select,
    getSelection: state.getSelection,
    clearSelection: state.clearSelection,
    selectItems: state.selectItems
  }));

  const { contractState, uploadFiles, relocateFiles } = useDriveState((state) => ({
    contractState: state.contractState,
    uploadFiles: state.uploadFiles,
    relocateFiles: state.relocateFiles
  }));
  
  const isFolder = file.contentType == "folder";

  const onFileDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    const appState = useAppStore.getState()

    if (!appState.selected[file.id]) {
      select(file.id)
    }
  };

  const onFileDrop = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (e.dataTransfer.files.length) {
      await uploadFiles(e.dataTransfer.files, file.id);
    }

    else {
      const selection = getSelection()
  
      if (selection.length && !selection.filter(id => !contractState.isRelocatable(id, file.id)).length) {
        relocateFiles(getSelection(), activeFileId, file.id);
        clearSelection()
      }
    }
  };

  const onFileDragOver = (e) => {
    e.preventDefault();
  };

  const onFileClick = (e) => {
    e.stopPropagation();
    
    const appState = useAppStore.getState()

    if (appState.showWallet) appState.setShowWallet(false)
    if (appState.contextMenuActivated) activateContextMenu(false)
    if (appState.searchActivated) useAppStore.setState({ searchActivated: false })

    if (file.pending) return

    switch (e.nativeEvent.pointerType) {
      case 'mouse': 
        const appState = useAppStore.getState()

        if (!appState.holdingControl && !appState.holdingShift) {
          clearSelection()
        }

        if (!selected) {
          if (appState.holdingShift && appState.firstSelected) {
            clearSelection(false)

            const children = contractState.getChildren(activeFileId)
            const folders = children.filter(x => x.contentType == 'folder')
            const files = children.filter(x => x.contentType != 'folder')

            const childrenGrouped = folders.concat(files).map(file => file.id)

            const firstSelectedIndex = childrenGrouped.findIndex(id => id == appState.firstSelected)
            const currentIndex = childrenGrouped.findIndex(id => id == file.id)

            const start = firstSelectedIndex < currentIndex ? firstSelectedIndex : currentIndex
            const end = firstSelectedIndex < currentIndex ? currentIndex : firstSelectedIndex

            selectItems(childrenGrouped.slice(start, end + 1))
          }

          else {
            select(file.id);
          }
        }

        break

      case 'touch':
        const selection = getSelection()

        if (selection.length) {
          select(file.id)
        }

        else if (file.contentType == 'folder') {
          router.push(`/drive/${file.id}`)
        }

        break
    }
  };

  const onFileContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (file.pending) return 

    if (!selected) {
      if (getSelection().length == 1) {
        clearSelection()
      }

      select(file.id);
    }

    activateContextMenu(true, {
      type: "file",
      file,
    });
  };

  const onFileDoubleClick = () => {
    if (file.pending || file.contentType != 'folder') return

    router.push(`/drive/${file.id}`)
  }

  return (
    <motion.div
      animate={{ opacity: file.pending ? 0.5 : 1 }}
      className={`${isFolder ? style.folder : style.file} ${selected ? style.selected : "" }`}
      draggable
      onDragStart={onFileDragStart}
      onDrop={onFileDrop}
      onDragOver={onFileDragOver}
      onDoubleClick={onFileDoubleClick}
      onClick={onFileClick}
      onContextMenu={onFileContextMenu}
    >
      {isFolder ? (
        <FolderInfo file={file} />
      ) : (
        <FileInfo
          file={file}
          className={style.filePreview}
          enableControls={enableControls}
        />
      )}
    </motion.div>
  );
}
