import { useRouter } from "next/navigation";
import { useAppState } from "../../stores/AppStore";
import { useBundlrState } from "../../stores/BundlrStore";
import FileInfo from "../FileInfo";
import FolderInfo from "../FolderInfo";
import style from "./style.module.css";

export default function File({ file, enableControls }) {
  const router = useRouter();
  const [activateContextMenu, selected, select] = useAppState((state) => [
    state.activateContextMenu,
    state.selected[file.id],
    state.select,
  ]);
  const [fileSystem, uploadFiles, rerender] = useBundlrState((state) => [
    state.fileSystem,
    state.uploadFiles,
    state.rerender,
  ]);
  const isFolder = file.type == "folder";

  const onFileDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", file.id);
  };

  const onFileDrop = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const dragFileId = e.dataTransfer.getData("text/plain");
    if (e.dataTransfer.files.length)
      await uploadFiles(e.dataTransfer.files, file.id);
    else if (fileSystem.fileMovableTo(dragFileId, file.id)) {
      await fileSystem.moveFile(dragFileId, file.id);
      rerender();
    }
  };

  const onFileDragOver = (e) => {
    e.preventDefault();
  };

  const onFileClick = (e) => {
    e.stopPropagation();
    select(file.id);
  };

  const onFileContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selected) {
      select(file.id);
    }

    activateContextMenu(true, {
      type: "file",
      copy: !isFolder,
      file,
    });
  };

  return (
    <div
      className={`${isFolder ? style.folder : style.file} ${
        selected ? style.selected : ""
      }`}
      draggable
      onDragStart={onFileDragStart}
      onDrop={onFileDrop}
      onDragOver={onFileDragOver}
      onDoubleClick={() => router.push(`/drive/${file.id}`)}
      onClick={onFileClick}
      onContextMenu={onFileContextMenu}
    >
      {isFolder ? (
        <FolderInfo file={file} />
      ) : (
        <FileInfo
          file={file}
          className={style.filePreview}
          enableControls={enableControls}
        />
      )}
    </div>
  );
}
