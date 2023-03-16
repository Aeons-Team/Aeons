import FilePreview from '../FilePreview'
import Utility from "../../lib/Utility";
import style from './style.module.css'

export default function FileInfo({ file }) {
  return (
    <>    
      <FilePreview 
        src={`https://arweave.net/${file.id}`} 
        type={file.contentType} />
        
      <div className={style.fileDetails}>
        <span className={style.fileDetail}>{file.name}</span>

        {file.pending && (
          <span
            className={style.fileDetail}
            style={{
              gridRow: 2,
              gridColumn: 1,
            }}
          >
            <span className={style.pending} />
            pending
          </span>
        )}

        <span
          className={style.fileDetail}
          style={{
            gridRow: 2,
            gridColumn: 2,
            textAlign: "right",
          }}
        >
          {file.size && Utility.formatSize(file.size)}
        </span>
      </div>
    </>
  )
};