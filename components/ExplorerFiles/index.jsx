import { useMediaQuery } from "react-responsive";
import { useAppState } from "../../stores/AppStore";
import File from "../File"
import ContextMenu from "../ContextMenu";
import Grid from "../Grid"
import style from './style.module.css'

export default function ExplorerFiles({ files, animate = true }) {
    const isMobile = useMediaQuery({ maxWidth: 500 })
    const scale = isMobile ? 0.8 : 1

    const { activateContextMenu } = useAppState((state) => ({
        activateContextMenu: state.activateContextMenu
    }));

    const onExplorerContextMenu = (e) => {
        e.preventDefault();
        activateContextMenu(true, {
            type: "explorer",
        });
    };

    return (
        <div 
            id='explorer-files' 
            className={style.explorerFiles}
            onContextMenu={onExplorerContextMenu}
        >
            <div className={style.explorerFilesInner}>
                <div className={style.section}>
                    <h1 className={style.sectionHeader}>
                        <span>Folders</span>
                    </h1>

                    {
                        animate ? (
                            <Grid minWidth={isMobile ? 150 : 200} height={scale * 160} gapScale={scale * 0.1}>
                                {files.filter((x) => x.contentType == "folder").map((x) => <File key={x.id} file={x} />)}
                            </Grid>
                        ) : ( 
                            <div className={style.folders}>
                                {files.filter((x) => x.contentType == "folder").map((x) => <File key={x.id} file={x} />)}
                            </div>
                        )
                    }
                </div>

                <div className={style.section} style={{ marginTop: animate ? '1rem' : 0 }}>
                    <h1 className={style.sectionHeader}>
                        <span>Files</span>
                    </h1>

                    {
                        animate ? (
                            <Grid minWidth={isMobile ? 150 : 200} height={scale * 260} gapScale={scale * 0.9}>
                                {files.filter((x) => x.contentType != "folder").map((x) => <File key={x.id} file={x} />)}
                            </Grid>
                        ) : (
                            <div className={style.files}>
                                {files.filter((x) => x.contentType != "folder").map((x) => <File key={x.id} file={x} />)}
                            </div>
                        )
                    }
                </div>
                
                <ContextMenu />
            </div>
        </div>
    )
}