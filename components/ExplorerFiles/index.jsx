import { useAppStore } from "../../stores/AppStore"
import File from "../File"
import style from './style.module.css'

export default function ExplorerFiles({ files }) {
    const explorerView = useAppStore(state => state.explorerView)
    const isGrid = explorerView == 'grid'

    return (
        <>
            <div className={style.section}>
                <h1 className={style.sectionTitle}>Folders</h1>
                <div className={isGrid ? style.folders : style.list}>
                    {files &&
                        files
                            .filter((x) => x.contentType == "folder")
                            .map((x) => <File key={x.id} file={x} />)}
                </div>
            </div>

            <div className={style.section}>
                <h1 className={style.sectionTitle}>Files</h1>
                <div className={isGrid ? style.files : style.list}>
                    {files &&
                        files
                            .filter((x) => x.contentType != "folder")
                            .map((x) => <File key={x.id} file={x} />)}
                </div>
            </div>
        </>
    )
}