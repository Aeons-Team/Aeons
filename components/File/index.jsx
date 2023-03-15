import Link from "next/link";
import { useAppStore } from "../../stores/AppStore";
import { useBundlrState } from "../../stores/BundlrStore";
import FilePreview from "../FilePreview";
import FolderPreview from "../FolderPreview";
import style from "./style.module.css";

export default function File({ file, enableControls }) {
  const activateContextMenu = useAppStore(state => state.activateContextMenu);
  const [fileSystem, rerender] = useBundlrState(state => [state.fileSystem, state.rerender]);
  const isFolder = file.type == 'folder'

  const onFileDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', file.id)
  }

  const onFileDrop = async (e) => {
    const dragFileId = e.dataTransfer.getData('text/plain')
    
    if (fileSystem.fileMovableTo(dragFileId, file.id)) {
      await fileSystem.moveFile(dragFileId, file.id)
      rerender()
    }
  }

  const onFileDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <Link
      className={isFolder ? style.folder : style.file}
      href={`/drive/${file.id}`}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();

        activateContextMenu(true, {
          type: "file",
          copy: !isFolder,
          file,
        });
      }}
      draggable
      onDragStart={onFileDragStart}
      onDrop={onFileDrop}
      onDragOver={onFileDragOver}
    >
      {
        isFolder 
        ? <FolderPreview file={file} />
        : <FilePreview
            file={file}
            className={style.filePreview}
            enableControls={enableControls}
          />
      }
    </Link>
  );
}
