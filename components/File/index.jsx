import { useRef, useEffect, useState } from 'react'
import { useRouter } from "next/router";
import { motion, useSpring } from "framer-motion";
import { useAppState, useAppStore } from "../../stores/AppStore";
import { useDriveState } from "../../stores/DriveStore";
import Crypto from "../../lib/Crypto";
import FileInfo from "../FileInfo";
import FolderInfo from "../FolderInfo";
import style from "./style.module.css";
import Vector from '../../lib/Vector2';

export default function File({ file }) {
  const router = useRouter();
  const fileRef = useRef();
  const countRef = useRef(0);
  const { id: activeFileId } = router.query;
  const x = useSpring(0, { stiffness: 200, damping: 25 })
  const y = useSpring(0, { stiffness: 200, damping: 25 })

  const isSearching = router.pathname.startsWith('/drive/search')
  const { search } = router.query

  const { activateContextMenu, selected, select, getSelection, clearSelection, selectItems, dragged } = useAppState((state) => ({
    activateContextMenu: state.activateContextMenu,
    selected: state.selected[file.id],
    select: state.select,
    getSelection: state.getSelection,
    clearSelection: state.clearSelection,
    selectItems: state.selectItems,
    dragged: state.beingDragged[file.id]
  }));

  const { contractState, uploadFiles, relocateFiles, contract } = useDriveState((state) => ({
    contractState: state.contractState,
    uploadFiles: state.uploadFiles,
    relocateFiles: state.relocateFiles,
    contract: state.contract
  }));

  const [moved, setMoved] = useState(false)

  useEffect(() => {
    if (dragged) {
      const explorer = document.querySelector('#explorer')

      if (!explorer) return

      const fileElem = fileRef.current
      fileElem.classList.add(style.higherZ)
  
      const cursor = useAppStore.getState().cursorPosition
      const result = new RegExp(/translate\((.+?)px, (.+?)px\)/).exec(fileElem.style.transform)
  
      let translate = new Vector(0, 0)
  
      if (result && result.length >= 3) {
        translate.set(new Number(result[1]), new Number(result[2]))
      }

      const onDragOver = (e) => {
        cursor.set(e.clientX, e.clientY)
  
        const bb = fileElem.getBoundingClientRect()
        const center = new Vector(bb.left - dragged * 10, bb.top - 5).sub(x.get(), y.get())

        translate = cursor.subv(center)

        x.set(translate.x)
        y.set(translate.y)
      }
  
      explorer.addEventListener('dragover', onDragOver)
  
      return () => {
        explorer.removeEventListener('dragover', onDragOver)

        if (file.parentId == activeFileId) {
          x.set(0)
          y.set(0)
        }

        else {
          setMoved(true)
        }

        fileElem.classList.remove(style.higherZ)
      }
    }
  }, [dragged])

  const isFolder = file.contentType == "folder";

  const onFileDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setDragImage(new Image(), 0, 0)

    const appState = useAppStore.getState()

    if (!appState.selected[file.id]) {
      clearSelection()
      select(file.id)
    }

    for (const id of getSelection()) {
      useAppStore.getState().setDragging(id)
    }
  };

  const onFileDragEnd = (e) => {
    e.dataTransfer.effectsAllowed = "none";
    useAppStore.getState().clearDragging()
  }

  const onFileDrop = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    countRef.current = 0
    fileRef.current.classList.remove(style.dragEnter)
        
    if (e.dataTransfer.files.length) {
      const files = Object.values(e.dataTransfer.files).filter(file => file.size != 0)
      uploadFiles(files, file.id);
    }

    else {
      const selection = getSelection()
  
      if (selection.length && !selection.filter(id => !contractState.isRelocatable(id, file.id)).length) {
        relocateFiles(selection, activeFileId, file.id);
        clearSelection();
      }
    }

    useAppStore.getState().clearDragging()
  };

  const onFileDragEnter = (e) => {
    e.stopPropagation()
    e.preventDefault();
    countRef.current++

    if (file.contentType != 'folder') return

    const selection = getSelection()    
    
    if (!selection.filter(id => !contractState.isRelocatable(id, file.id)).length) {
      fileRef.current.classList.add(style.dragEnter)
    }
  };
  
  const onFileDragLeave = (e) => {
    e.stopPropagation()

    if (--countRef.current == 0) {
      fileRef.current.classList.remove(style.dragEnter)
    }
  };

  const onFileClick = (e) => {
    if (activeFileId != file.parentId) return

    e.stopPropagation();
    e.preventDefault();
    document.getSelection().removeAllRanges();
    
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

            const children = isSearching ? contractState.searchFiles(search) : contractState.getChildren(activeFileId)
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

        else {
          window.open(`${process.env.NEXT_PUBLIC_ARWEAVE_URL}/${file.id}`)
        }

        break
    }
  };

  const onFileContextMenu = (e) => {
    if (activeFileId != file.parentId) return

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

  const onFileDoubleClick = async () => {
    if (file.pending) return

    if (file.contentType == 'folder') {
      if(activeFileId != 'archive') {
        router.push(`/drive/${file.id}`)
      } 
    }
    else if(file.encryption) {
      const decryptedUrl = await Crypto.decryptedFileUrl(file.id, file.encryption, contract.internalWallet.privateKey, file.contentType)
      window.open(decryptedUrl)
    }
    else {
      window.open(`${process.env.NEXT_PUBLIC_ARWEAVE_URL}/${file.id}`)
    }
  }

  return (
    <motion.div
      ref={fileRef}
      animate={{ 
        opacity: file.pending ? 0.5 : 1,
        scale: moved ? 0.25 : (dragged ? 0.5 : 1)
      }}
      style={{
        x, y
      }}
      className={`${isFolder ? style.folder : style.file} ${selected ? style.selected : "" }`}
      draggable={!file.pending && !isSearching}
      onDragStart={onFileDragStart}
      onDragEnd={onFileDragEnd}
      onDrop={onFileDrop}
      onDragEnter={onFileDragEnter}
      onDragLeave={onFileDragLeave}
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
        />
      )}
    </motion.div>
  );
}
