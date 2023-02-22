import { useAppContext } from '../../contexts/AppContext';
import FilePreview from '../FilePreview';
import Utility from '../../lib/Utility'
import style from './style.module.css';

export default function File({ data, enableControls }) {
  const { activateContextMenu, setCurrentFile } = useAppContext();

  return (
    <div 
      className={style.file}
      onClick={() => setCurrentFile(data.id)}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()

        activateContextMenu(true, {
          type: 'file',
          data
        })
      }}>
      <FilePreview src={`https://arweave.net/${data.id}`} type={data.contentType} className={style.filePreview} enableControls={enableControls} />

      <div className={style.fileDetails}>
        <span>
          {data.name}
        </span>
        
        <span>
          {data.contentType}
        </span>
        
        <span>
          {data.size && Utility.formatSize(data.size)}
        </span>
      </div>
    </div>
  )
}