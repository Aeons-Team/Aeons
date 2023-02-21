import { useBundlrContext } from '../../contexts/BundlrContext';
import FilePreview from '../FilePreview';
import FolderPreview from '../FolderPreview';
import style from './style.module.css';

export default function Explorer() {
  const { fileSystem, currentFolder, setCurrentFolder } = useBundlrContext()
  const children = fileSystem.hierarchy.getChildren(currentFolder)

  return (
    <div>
      Folders:
      <div className={style.folders}>
        {
          children
          .filter((x) => x.type == "folder")
          .map((x, i) => 
            <FolderPreview key={i} name={x.name} onClick={() => setCurrentFolder(x.id)} />
          )
        }
      </div>
      
      Files :
      <div className={style.files}>
        {
          children
            .filter((x) => x.type == "file")
            .map((x, i) => <FilePreview key={i} src={`https://arweave.net/${x.id}`} type={x.contentType} />)
        }
      </div>
    </div>
  );
}