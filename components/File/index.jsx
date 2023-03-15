import Link from "next/link";
import { useAppStore } from "../../stores/AppStore";
import FilePreview from "../FilePreview";
import FolderPreview from "../FolderPreview";
import style from "./style.module.css";

export default function File({ data, enableControls }) {
  const activateContextMenu = useAppStore(state => state.activateContextMenu);
  const isFolder = data.type == 'folder'

  return (
    <Link
      className={isFolder ? style.folder : style.file}
      href={`/drive/${data.id}`}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();

        activateContextMenu(true, {
          type: "file",
          copy: !isFolder,
          data,
        });
      }}
    >
      {
        isFolder 
        ? <FolderPreview data={data} />
        : <FilePreview
            data={data}
            className={style.filePreview}
            enableControls={enableControls}
          />
      }
    </Link>
  );
}
