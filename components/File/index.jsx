import Link from "next/link";
import { useAppContext } from "../../contexts/AppContext";
import FilePreview from "../FilePreview";
import Utility from "../../lib/Utility";
import style from "./style.module.css";

export default function File({ data, enableControls }) {
  const { activateContextMenu } = useAppContext();

  return (
    <Link
      className={style.file}
      href={`/drive/${data.id}`}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();

        activateContextMenu(true, {
          type: "file",
          copy: true,
          data,
        });
      }}
    >
      <FilePreview
        src={`https://arweave.net/${data.id}`}
        type={data.contentType}
        className={style.filePreview}
        enableControls={enableControls}
      />

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
    </Link>
  );
}
