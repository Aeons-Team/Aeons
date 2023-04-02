import { useAppState, useAppStore } from '../../stores/AppStore'
import FilePreview from '../FilePreview'
import IconButton from '../IconButton'
import Utility from "../../lib/Utility"
import style from './style.module.css'

export default function FileInfo({ file, view }) {
  const { explorerView, activateContextMenu, select } = useAppState(state => ({
    explorerView: state.explorerView,
    activateContextMenu: state.activateContextMenu,
    select: state.select
  }))

  const isGrid = view || (explorerView == 'grid')

  return (
    <>    
      {
        !view &&
        <IconButton 
          name='dots-horizontal' 
          fill 
          onClick={(e) => {
            e.stopPropagation()

            const appState = useAppStore.getState()

            if (!appState.selected[file.id]) {
              select(file.id)
            }

            activateContextMenu(true, {
              type: "file",
              copy: file.contentType != 'folder',
              file,
            })
          }}
        />
      }

      <FilePreview 
        className={isGrid ? '' : style.previewList}
        src={`${process.env.NEXT_PUBLIC_ARWEAVE_URL}/${file.id}`} 
        contentType={file.contentType} 
      />
        
      <div className={isGrid ? style.fileDetails : style.fileDetailsList}>
        <span className={style.fileDetail}>
          {file.name}
        </span>

        <span className={style.fileDetail}>
          {file.size && Utility.formatBytes(file.size)}
        </span>
      </div>
    </>
  )
};