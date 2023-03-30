import FilePreview from '../FilePreview'
import Utility from "../../lib/Utility";
import style from './style.module.css'

export default function FileInfo({ file }) {
  return (
    <>    
      <FilePreview 
        src={`${process.env.NEXT_PUBLIC_ARWEAVE_URL}/${file.id}`} 
        contentType={file.contentType} />
        
      <div className={style.fileDetails}>
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