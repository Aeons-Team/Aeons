import { useRouter } from 'next/router'
import Ancestors from '../Ancestors'
import ExplorerActions from '../ExplorerActions'
import style from './style.module.css'

export default function ExplorerBar() {
    const { id: activeFileId } = useRouter().query

    return (
        <div className={style.explorerBar}>
            <Ancestors id={activeFileId} />
            <ExplorerActions />
        </div>
    )
}