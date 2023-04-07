import { useMediaQuery } from "react-responsive";
import { useAppState } from "../../stores/AppStore";
import ContextMenu from "../ContextMenu";
import Grid from "../Grid"
import style from './style.module.css'

export default function ExplorerFiles({ files }) {
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

                    <Grid 
                        minWidth={isMobile ? 150 : 200} 
                        height={scale * 160} 
                        gapScale={scale * 0.1}
                        files={files.filter((x) => x.contentType == "folder")}
                    />
                </div>

                <div className={style.section} style={{ marginTop: '1rem' }}>
                    <h1 className={style.sectionHeader}>
                        <span>Files</span>
                    </h1>

                    <Grid 
                        minWidth={isMobile ? 150 : 200} 
                        height={scale * 260} 
                        gapScale={scale * 0.9}
                        files={files.filter((x) => x.contentType != "folder")}
                    />
                </div>
                
                <ContextMenu />
            </div>
        </div>
    )
}