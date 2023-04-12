import Spinner from 'react-spinner-material'
import { useAppState, useAppStore } from '../../stores/AppStore'
import FilePreview from '../FilePreview'
import IconButton from '../IconButton'
import Icon from '../Icon'
import Utility from "../../lib/Utility"
import style from './style.module.css'

export default function FileInfo({ file }) {
  const { activateContextMenu, select, getSelection, clearSelection } = useAppState(state => ({
    activateContextMenu: state.activateContextMenu,
    select: state.select,
    getSelection: state.getSelection,
    clearSelection: state.clearSelection
  }))

  return (
    <>
      <div className={style.fileHeader}>
        {
          !file.pending &&
          <IconButton 
            className={style.menuIcon}
            onClick={(e) => {
              e.stopPropagation()

              const appState = useAppStore.getState()

              if (!appState.selected[file.id]) {
                if (getSelection().length == 1) {
                  clearSelection()
                }
                
                select(file.id)
              }

              activateContextMenu(true, {
                type: "file",
                file
              })
            }}
            name='dots-vertical' 
            width='1.25rem'
            height='1.25rem'
          />
        }

        {
          file.pending &&
          <Spinner className={style.spinner2} radius={15} stroke={1} color='var(--color-active)' />
        }
      </div>

      <div className={style.previewContainer}>
        <FilePreview 
          className={style.preview}
          src={`${process.env.NEXT_PUBLIC_ARWEAVE_URL}/${file.id}`} 
          encryption={file.encryption}
          contentType={file.contentType} 
          size={300}
        />
      </div>
        
      <div className={style.fileBottom}>
        <span className={style.fileIcon}>
          <Icon name='file' width='1.75rem' height='1.75rem' fill />
        </span>
      
        <div className={style.fileDetails}>
          <span className={style.fileName}>{file.name}</span>

          <div className={style.fileDetailsBottom}>
            <div>
              <span>
                {file.size && Utility.formatBytes(file.size)}
              </span>

              {
                file.encryption && 
                <>
                  <span>•</span>
                  <span>Secure</span>
                </>
              }
            </div>

            <span>
              {Utility.formatDate(file.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </>
  )
};