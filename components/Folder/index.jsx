import { useAppContext } from '../../contexts/AppContext';
import style from './style.module.css';

export default function FolderPreview({ data }) {
  const { setCurrentFile } = useAppContext()

  return (
    <div className={style.preview} onClick={() => setCurrentFile(data.id)}>
      <svg viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.14286 1.16667V12.8333H14.8571V3.5H7.53143L5.24114 1.16667H1.14286ZM0.571429 0H5.712L8.00457 2.33333H15.4286C15.5801 2.33333 15.7255 2.39479 15.8326 2.50419C15.9398 2.61358 16 2.76196 16 2.91667V13.4167C16 13.5714 15.9398 13.7197 15.8326 13.8291C15.7255 13.9385 15.5801 14 15.4286 14H0.571429C0.419876 14 0.274531 13.9385 0.167368 13.8291C0.0602039 13.7197 0 13.5714 0 13.4167V0.583333C0 0.428624 0.0602039 0.280251 0.167368 0.170854C0.274531 0.0614583 0.419876 0 0.571429 0Z" fill="white"/>
      </svg>

      <span>
        {data.name}
      </span>
    </div>
  )
}