import File from "../File"
import style from './style.module.css'

export default function ExplorerFiles({ files }) {
    return (
        <>
            <div className={style.section}>
                <h1 className={style.sectionHeader}>
                    <span>Folders</span>
                </h1>
                <div className={style.folders}>
                    {files.filter((x) => x.contentType == "folder").map((x) => <File key={x.id} file={x} />)}
                </div>
            </div>

            <div className={style.section}>
                <h1 className={style.sectionHeader}>
                    <span>Files</span>
                </h1>
                <div className={style.files}>
                    {files.filter((x) => x.contentType != "folder").map((x) => <File key={x.id} file={x} />)}
                </div>
            </div>
        </>
    )
}