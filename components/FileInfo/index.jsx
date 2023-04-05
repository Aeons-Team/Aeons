import { useState } from 'react'
import Spinner from 'react-spinner-material'
import { useAppState, useAppStore } from '../../stores/AppStore'
import FilePreview from '../FilePreview'
import IconButton from '../IconButton'
import Utility from "../../lib/Utility"
import Icon from '../Icon'
import style from './style.module.css'

export default function FileInfo({ file }) {
  const { activateContextMenu, select } = useAppState(state => ({
    activateContextMenu: state.activateContextMenu,
    select: state.select
  }))

  const [loading, setLoading] = useState(true)

  return (
    <>
      <div className={style.fileHeader}>
        <Icon name='folder' width='1.25rem' height='1.25rem' fill />

        <span className={style.fileName}>{file.name}</span>

        {
          !file.pending &&
          <IconButton 
            name='dots-vertical' 
            width='1.1rem'
            height='1.1rem'
            onClick={(e) => {
              e.stopPropagation()

              const appState = useAppStore.getState()

              if (!appState.selected[file.id]) {
                select(file.id)
              }

              activateContextMenu(true, {
                type: "file",
                file,
              })
            }}
          />
        }

        {
          file.pending &&
          <Spinner className={style.spinner2} radius={13} stroke={1} color='var(--color-active)' />
        }
      </div>

      <div className={style.previewContainer}>
        <FilePreview 
          className={style.preview}
          onLoad={() => setLoading(false)}
          src={`${process.env.NEXT_PUBLIC_ARWEAVE_URL}/${file.id}`} 
          contentType={file.contentType} 
        />

        {
          loading && <Spinner className={style.spinner} radius={20} stroke={2} color='var(--color-active)' />
        }
      </div>
        
      <div className={style.fileDetails}>
        <span>
          {file.size && Utility.formatBytes(file.size)}
        </span>

        <span>
          {Utility.formatDate(file.createdAt)}
        </span>
      </div>
    </>
  )
};