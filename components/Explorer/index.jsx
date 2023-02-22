import { useAppContext } from '../../contexts/AppContext';
import { useBundlrContext } from '../../contexts/BundlrContext';
import Folder from '../Folder';
import File from '../File';
import style from './style.module.css';

export default function Explorer() {
  const { activateContextMenu, currentFile } = useAppContext();
  const { fileSystem } = useBundlrContext();
  const fileData = fileSystem.hierarchy.getFile(currentFile);
  const children = fileData.children;

  return (
    <div 
      className={style.explorer} 
      onContextMenu={(e) => {
        e.preventDefault()
        activateContextMenu(true, {
          type: 'explorer'
        })
      }}>
      {
        children 
        ? <>        
          <div className={style.section}>
            <h1 className={style.sectionTitle}>Folders</h1>
            <div className={style.folders}>
              {
                children
                .filter((x) => x.type == "folder")
                .map(x => <Folder key={x.id} data={x} />)
              }
            </div>
          </div>
          
          <div className={style.section}>
            <h1 className={style.sectionTitle}>Files</h1>
            <div className={style.files}>
              {
                children
                  .filter((x) => x.type == "file")
                  .map(x => <File key={x.id} data={x} />)
              }
            </div>
          </div>
        </> 

        : <>
          <File data={fileData} enableControls />
        </>
      }
    </div>
  );
}