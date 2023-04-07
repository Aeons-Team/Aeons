import { useRouter } from "next/router";
import { useRef, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useAppState } from "../../stores/AppStore";
import { useSpring } from "framer-motion";
import ContextMenu from "../ContextMenu";
import Grid from "../Grid"
import style from './style.module.css'

export default function ExplorerFiles({ files, className }) {
    const { id: activeFileId } = useRouter().query

    const isMobile = useMediaQuery({ maxWidth: 500 })
    const scale = isMobile ? 0.8 : 1
    const innerRef = useRef()
    const scrollMotion = useSpring(0, { stiffness: 100, damping: 15 })

    const { activateContextMenu } = useAppState((state) => ({
        activateContextMenu: state.activateContextMenu
    }));

    const onExplorerContextMenu = (e) => {
        e.preventDefault();
        activateContextMenu(true, {
            type: "explorer",
        });
    };

    useEffect(() => {
        scrollMotion.jump(innerRef.current.scrollTop)
        scrollMotion.set(0)

        scrollMotion.onChange(() => {
            innerRef.current.scrollTop = scrollMotion.get()
        })

        return () => {
            scrollMotion.clearListeners()
        }
    }, [activeFileId])

    return (
        <div 
            className={className}
            onContextMenu={onExplorerContextMenu}
        >
            <div id='explorer-files' ref={innerRef} className={style.explorerFilesInner}>
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