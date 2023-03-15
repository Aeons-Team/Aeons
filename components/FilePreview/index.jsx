import Utility from "../../lib/Utility";
import style from './style.module.css'

export default function FilePreview({ file, className, enableControls }) {
  let preview
  let src = `https://arweave.net/${file.id}`

  if (file.contentType.match("image/*")) {
    preview = <img src={src} className={className} />;
  }

  if (file.contentType.match("video/*")) {
    preview = (
      <video className={className} controls={enableControls}>
        <source src={src} />
      </video>
    );
  }

  if (file.contentType.match("audio/*")) {
    preview = (
      <audio className={className} controls>
        <source src={src} />
      </audio>
    );
  }

  return (
    <>    
      {preview}
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