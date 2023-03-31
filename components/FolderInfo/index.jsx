import Icon from '../Icon'
import style from './style.module.css'

export default function FolderInfo({ file }) {
    return (
        <div className={style.folderInfo}>
            <Icon name='folder' width='1.5rem' height='1.5rem' />

            <span>{file.name}</span>
        </div>
    )
}