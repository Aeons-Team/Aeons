import Utility from "../../lib/Utility";
import style from './style.module.css'

export default function FilePreview({ data, className, enableControls }) {
  let preview
  let src = `https://arweave.net/${data.id}`

  if (data.contentType.match("image/*")) {
    preview = <img src={src} className={className} />;
  }

  if (data.contentType.match("video/*")) {
    preview = (
      <video className={className} controls={enableControls}>
        <source src={src} />
      </video>
    );
  }

  if (data.contentType.match("audio/*")) {
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
        <span className={style.fileDetail}>{data.name}</span>

        {data.pending && (
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
          {data.size && Utility.formatSize(data.size)}
        </span>
      </div>
    </>
  )
};