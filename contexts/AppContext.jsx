import { createContext, useState, useEffect, useContext } from "react";
import { useBundlrContext } from "./BundlrContext";
import Vector2 from "../lib/Vector2";

const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [cursorPosition, setCursorPosition] = useState(new Vector2());
  const [contextMenuActivated, setContextMenuActivated] = useState(false);
  const [contextMenuOpts, setContextMenuOpts] = useState({});
  const [contextMenuPosition, setContextMenuPosition] = useState(new Vector2());
  const [currentFile, setCurrentFile] = useState("root");
  const [currentFileAncestors, setCurrentFileAncestors] = useState(["root"]);
  const { fileSystem } = useBundlrContext();

  useEffect(() => {
    if (fileSystem.hierarchy) {
      setCurrentFileAncestors(fileSystem.hierarchy.getAncestors(currentFile));
    }
  }, [currentFile]);

  useEffect(() => {
    if (!contextMenuActivated) {
      setContextMenuOpts({});
    }
  }, [contextMenuActivated]);

  useEffect(() => {
    const onDocumentMouseMove = (e) => {
      setCursorPosition(
        new Vector2(e.clientX, e.clientY + document.documentElement.scrollTop)
      );
    };

    document.addEventListener("mousemove", onDocumentMouseMove);

    return () => {
      document.removeEventListener("mousemove", onDocumentMouseMove);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        cursorPosition,
        activateContextMenu: (flag, opts) => {
          setContextMenuActivated(flag);

          if (flag) {
            setContextMenuPosition(cursorPosition);
            setContextMenuOpts(opts);
          }
        },
        contextMenuActivated,
        contextMenuPosition,
        contextMenuOpts,
        currentFile,
        setCurrentFile,
        currentFileAncestors,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
