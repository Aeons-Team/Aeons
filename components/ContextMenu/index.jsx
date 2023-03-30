import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import copy from "clipboard-copy";
import { useAppState } from "../../stores/AppStore";
import Uploader from "../Uploader";
import style from "./style.module.css";
import FolderSelect from "../FolderSelect";
import FolderCreator from "../FolderCreator";
import Rename from "../Rename";

export default function ContextMenu() {
  const menuRef = useRef();
  const router = useRouter()
  
  const { contextMenuActivated, contextMenuPosition, contextMenuOpts, activateContextMenu, getSelection } = useAppState((state) => ({
    contextMenuActivated: state.contextMenuActivated,
    contextMenuPosition: state.contextMenuPosition,
    contextMenuOpts: state.contextMenuOpts,
    activateContextMenu: state.activateContextMenu,
    getSelection: state.getSelection,
  }));

  const [action, setAction] = useState();

  useEffect(() => {
    const onClick = (e) => {
      activateContextMenu(false);
      setAction();
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);

  switch (action) {
    case "uploadingFile":
      var contextMenuInner = <Uploader />;
      break;

    case "creatingFolder":
      var contextMenuInner = <FolderCreator />;
      break;

    case "moveFile":
      var contextMenuInner = <FolderSelect />;
      break;

    case "rename":
      var contextMenuInner = <Rename />;
      break;

    default:
      switch (contextMenuOpts.type) {
        case "explorer":
          var contextMenuInner = (
            <>
              <div
                className={style.contextMenuButton}
                onClick={() => setAction("uploadingFile")}
              >
                <svg className={style.invert} width="23" height="29" viewBox="0 0 23 29" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.5 6.97735V24.8139C22.5 26.7124 20.961 28.2514 19.0625 28.2514H3.9375C2.03902 28.2514 0.5 26.7124 0.5 24.8139V4.18888C0.5 2.2904 2.03902 0.751378 3.9375 0.751378H16.274C16.4566 0.739801 16.6466 0.800658 16.7986 0.952742L22.2986 6.45274C22.4507 6.60483 22.5116 6.79482 22.5 6.97735ZM15.625 2.12638H3.9375C2.79841 2.12638 1.875 3.04979 1.875 4.18888V24.8139C1.875 25.953 2.79841 26.8764 3.9375 26.8764H19.0625C20.2016 26.8764 21.125 25.953 21.125 24.8139V7.62638H16.3125C15.9328 7.62638 15.625 7.31857 15.625 6.93888V2.12638ZM17 3.09865V6.25138H20.1527L17 3.09865ZM11.5 12.7223V22.0625C11.5 22.4422 11.1922 22.75 10.8125 22.75C10.4328 22.75 10.125 22.4422 10.125 22.0625V12.7223L7.17364 15.6736C6.90515 15.9421 6.46985 15.9421 6.20136 15.6736C5.93288 15.4052 5.93288 14.9698 6.20136 14.7014L10.3264 10.5764C10.5948 10.3079 11.0302 10.3079 11.2986 10.5764L15.4236 14.7014C15.6921 14.9698 15.6921 15.4052 15.4236 15.6736C15.1552 15.9421 14.7198 15.9421 14.4514 15.6736L11.5 12.7223Z" />
                </svg>

                Upload File
              </div>

              <div
                className={style.contextMenuButton}
                onClick={() => setAction("creatingFolder")}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 8.00004V22.4C4 23.8935 4 24.6398 4.29065 25.2102C4.54631 25.7119 4.95396 26.1207 5.45573 26.3763C6.0256 26.6667 6.77199 26.6667 8.26255 26.6667H23.7375C25.228 26.6667 25.9733 26.6667 26.5432 26.3763C27.0449 26.1207 27.454 25.7122 27.7096 25.2104C28.0003 24.64 28.0003 23.8932 28.0003 22.3998V12.2664C28.0003 10.7729 28.0003 10.0262 27.7096 9.45577C27.454 8.954 27.0452 8.54635 26.5435 8.29069C25.9731 8.00004 25.2268 8.00004 23.7333 8.00004H16M4 8.00004H16M4 8.00004C4 6.52728 5.19391 5.33337 6.66667 5.33337H11.566C12.2183 5.33337 12.5451 5.33337 12.8521 5.40705C13.1241 5.47237 13.3839 5.58039 13.6224 5.7266C13.8915 5.89147 14.1224 6.12247 14.5833 6.58337L16 8.00004" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                Create Folder
              </div>
            </>
          );

          break;

        case "file":
          var contextMenuInner = (
            <>
              <div
                className={style.contextMenuButton}
                onClick={() => {
                  router.push(`/drive/${getSelection()[0]}`)
                }}
              >
                <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 18V9C7.5 8.17158 8.17158 7.5 9 7.5H27C27.8284 7.5 28.5 8.17158 28.5 9V27C28.5 27.8284 27.8284 28.5 27 28.5H18M12.1667 18H18M18 18V23.8333M18 18L7.5 28.5" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                Open
              </div>

              {contextMenuOpts.copy && getSelection().length < 2 && (
                <div
                  className={style.contextMenuButton}
                  onClick={() => {
                    activateContextMenu(false);
                    setAction();
                    copy(
                      `${process.env.NEXT_PUBLIC_ARWEAVE_URL}/${
                        getSelection()[0]
                      }`
                    );
                  }}
                >
                  <svg width="34" height="34" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.9934 21.0074L21.0073 12.9935M9.98872 15.9984L7.98524 18.0018C5.77228 20.2148 5.77163 23.8031 7.9846 26.0161C10.1976 28.229 13.7866 28.2283 15.9996 26.0153L18.0009 24.0122M15.9983 9.98746L18.0017 7.984C20.2147 5.77102 23.8023 5.77142 26.0152 7.98439C28.2282 10.1974 28.2281 13.7853 26.0151 15.9982L24.0126 18.0017" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>

                  Copy url
                </div>
              )}

              <div
                className={style.contextMenuButton}
                onClick={() => {
                  setAction("moveFile");
                }}
              >
                <svg className={style.invert} width="27" height="22" viewBox="0 0 27 22" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.66291 0.625C9.18331 0.625 9.6875 0.798146 10.097 1.11496L10.2063 1.2049L11.8226 2.6192C11.9413 2.72304 12.088 2.78805 12.2432 2.80683L12.3371 2.8125H23.1562C24.4089 2.8125 25.432 3.79523 25.4968 5.03178L25.5 5.15625L25.5006 10.0352C25.0295 9.61353 24.5048 9.25048 23.9379 8.9576L23.9375 5.15625C23.9375 4.75174 23.6301 4.41904 23.2361 4.37903L23.1562 4.375L12.2796 4.3743L10.9503 6.0092C10.5349 6.52044 9.92517 6.83157 9.27189 6.87079L9.1313 6.875L2.0625 6.87437V17.0312C2.0625 17.4358 2.36992 17.7685 2.76387 17.8085L2.84375 17.8125L13.3241 17.8128C13.4917 18.3633 13.721 18.8869 14.0037 19.3757L2.84375 19.375C1.59109 19.375 0.567954 18.3923 0.503249 17.1557L0.5 17.0312V2.96875C0.5 1.71609 1.48273 0.692954 2.71928 0.628249L2.84375 0.625H8.66291ZM8.66291 2.1875H2.84375C2.43924 2.1875 2.10654 2.49492 2.06653 2.88887L2.0625 2.96875V5.31187L9.1313 5.3125C9.33715 5.3125 9.53341 5.23133 9.67864 5.08872L9.73764 5.0239L10.7594 3.76562L9.17737 2.3808C9.05869 2.27696 8.91196 2.21195 8.75684 2.19316L8.66291 2.1875ZM20.5 9.375C23.9518 9.375 26.75 12.1732 26.75 15.625C26.75 19.0768 23.9518 21.875 20.5 21.875C17.0482 21.875 14.25 19.0768 14.25 15.625C14.25 12.1732 17.0482 9.375 20.5 9.375ZM20.4994 12.2714L20.4294 12.3186L20.3706 12.3706L20.3186 12.4294C20.1438 12.6542 20.1438 12.9708 20.3186 13.1956L20.3706 13.2544L22.1156 15H17.375L17.3021 15.0042C17.0152 15.0375 16.7875 15.2652 16.7542 15.5521L16.75 15.625L16.7542 15.6979C16.7875 15.9848 17.0152 16.2125 17.3021 16.2458L17.375 16.25H22.1156L20.3706 17.9956L20.3186 18.0544C20.1279 18.2996 20.1453 18.6541 20.3706 18.8794C20.5959 19.1047 20.9504 19.1221 21.1956 18.9314L21.2544 18.8794L24.0669 16.0669L24.0986 16.0328L24.1435 15.9741L24.172 15.9277L24.1915 15.8895L24.2189 15.8201L24.2329 15.7709L24.2457 15.6984L24.25 15.625L24.2481 15.5775L24.2374 15.4995L24.219 15.4302L24.2055 15.3929L24.1721 15.3225L24.1435 15.2759L24.117 15.2395L24.0928 15.2105L24.0669 15.1831L21.2544 12.3706L21.1956 12.3186C20.9933 12.1613 20.7166 12.1456 20.4994 12.2714Z" />
                </svg>

                Move
              </div>

              {getSelection().length < 2 && (
                <div
                  className={style.contextMenuButton}
                  onClick={() => {
                    setAction("rename");
                  }}
                >
                  <svg className={style.invert} width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5893 2.14282C12.1456 2.14282 11.7858 2.5026 11.7858 2.94639C11.7858 3.39019 12.1456 3.74997 12.5893 3.74997H14.1965V26.25H12.5893C12.1456 26.25 11.7858 26.6098 11.7858 27.0535C11.7858 27.4973 12.1456 27.8571 12.5893 27.8571H17.4108C17.8546 27.8571 18.2143 27.4973 18.2143 27.0535C18.2143 26.6098 17.8546 26.25 17.4108 26.25H15.8036V3.74997H17.4108C17.8546 3.74997 18.2143 3.39019 18.2143 2.94639C18.2143 2.5026 17.8546 2.14282 17.4108 2.14282H12.5893Z" />
                    <path d="M6.69638 6.44958H13.1249V8.05673H6.69638C5.66084 8.05673 4.82138 8.89619 4.82138 9.93173V20.1103C4.82138 21.1459 5.66084 21.9853 6.69638 21.9853H13.1249V23.5925H6.69638C4.77324 23.5925 3.21423 22.0334 3.21423 20.1103V9.93173C3.21423 8.00859 4.77324 6.44958 6.69638 6.44958Z" />
                    <path d="M23.3036 21.9853H16.875V23.5925H23.3036C25.2267 23.5925 26.7857 22.0334 26.7857 20.1103V9.93173C26.7857 8.00859 25.2267 6.44958 23.3036 6.44958H16.875V8.05673H23.3036C24.3391 8.05673 25.1786 8.89619 25.1786 9.93173V20.1103C25.1786 21.1459 24.3391 21.9853 23.3036 21.9853Z" />
                  </svg>

                  Rename
                </div>
              )}

              <div
                className={style.contextMenuButton}
              >
                <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.25 16.25H18.75" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.75 8.125C3.75 7.54417 3.75 7.25377 3.79804 7.01227C3.9953 6.02055 4.77055 5.2453 5.76227 5.04804C6.00377 5 6.29418 5 6.875 5H15H23.125C23.7059 5 23.9962 5 24.2377 5.04804C25.2295 5.2453 26.0047 6.02055 26.202 7.01227C26.25 7.25377 26.25 7.54417 26.25 8.125C26.25 8.70582 26.25 8.99622 26.202 9.23772C26.0047 10.2294 25.2295 11.0047 24.2377 11.202C23.9962 11.25 23.7059 11.25 23.125 11.25H15H6.875C6.29418 11.25 6.00377 11.25 5.76227 11.202C4.77055 11.0047 3.9953 10.2294 3.79804 9.23772C3.75 8.99622 3.75 8.70582 3.75 8.125Z" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M5 11.25V19.9999C5 22.357 5 23.5355 5.73224 24.2677C6.46446 24.9999 7.64298 24.9999 10 24.9999H11.25H18.75H20C22.357 24.9999 23.5355 24.9999 24.2677 24.2677C25 23.5355 25 22.357 25 19.9999V11.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                Archive
              </div>
            </>
          );

          break;
      }
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      ref={menuRef}
      className={style.contextMenu}
      style={{
        pointerEvents: contextMenuActivated ? "auto" : "none",
        left: contextMenuPosition.x + "px",
        top: contextMenuPosition.y + "px",
      }}
    >
      {contextMenuActivated && contextMenuInner}
    </div>
  );
}
