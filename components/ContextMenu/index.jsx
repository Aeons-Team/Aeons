import { useState, useEffect, useRef } from 'react';
import copy from 'clipboard-copy'
import { motion } from 'framer-motion'
import { useAppContext } from '../../contexts/AppContext';
import FileUploader from '../FileUploader';
import FolderCreator from '../FolderCreator';
import Funder from '../Funder';
import style from './style.module.css';

export default function ContextMenu() {
  const menuRef = useRef();
  const { contextMenuActivated, contextMenuPosition, contextMenuOpts, setCurrentFile, activateContextMenu } = useAppContext();
  const [action, setAction] = useState();

  useEffect(() => {
    const onDocumentClick = (e) => {
      activateContextMenu(false)
    }

    document.addEventListener('click', onDocumentClick)

    return () => {
      document.removeEventListener('click', onDocumentClick)
    }
  }, [])

  useEffect(() => {
    if (!contextMenuActivated) {
      setAction('');
    }
  }, [contextMenuActivated]);

  switch (action) {
    case 'uploadingFile':
      var contextMenuInner = <FileUploader />
      break
    
    case 'creatingFolder':
      var contextMenuInner = <FolderCreator />
      break
    
    case 'fundingWallet':
      var contextMenuInner = <Funder />
      break
    
    default: 
      switch (contextMenuOpts.type) {
        case 'explorer':
          var contextMenuInner = <>
            <div className={style.contextMenuButton} onClick={() => setAction('uploadingFile')}>
              Upload File
            </div>
            
            <div className={style.contextMenuButton} onClick={() => setAction('creatingFolder')}>
              Create Folder
            </div>
    
            <div className={style.contextMenuButton} onClick={() => setAction('fundingWallet')}>
              Fund Wallet
            </div>
          </>
    
          break
    
        case 'hierarchy': 
          var contextMenuInner = <>
            <div 
              className={style.contextMenuButton} 
              onClick={() => {
                activateContextMenu(false)
                setCurrentFile(contextMenuOpts.data.id)
              }
            }>
              open
            </div>
          </>
          break
        
          case 'file': 
          var contextMenuInner = <>
            <div 
              className={style.contextMenuButton} 
              onClick={() => {
                activateContextMenu(false)
                copy(`https://arweave.net/${contextMenuOpts.data.id}`)
              }}>
                Copy url
            </div>
          </>

          break
      }
  }

  return (
    <motion.div 
      onClick={(e) => {
        e.stopPropagation()
      }}
      ref={menuRef}
      className={style.contextMenu}
      style={{ 
        pointerEvents: contextMenuActivated ? 'auto' : 'none',
        left: contextMenuPosition.x + 'px',
        top: contextMenuPosition.y + 'px',
      }}>
      {
        contextMenuActivated && contextMenuInner
      }
    </motion.div>
  );
}