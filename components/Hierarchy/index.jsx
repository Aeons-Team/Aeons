import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useBundlrState } from "../../stores/BundlrStore";
import { useAppStore } from "../../stores/AppStore";
import style from "./style.module.css";
import Utility from "../../lib/Utility";

function HierarchyItem({ item, depth, fileId }) {
  const router = useRouter();
  const { id: activeFileId } = router.query;
  const [collapsed, setCollapsed] = useState(false);
  const [fileSystem, rerender, render] = useBundlrState((state) => [
    state.fileSystem,
    state.rerender,
    state.render,
  ]);

  const activateContextMenu = useAppStore((state) => state.activateContextMenu);
  const activeFile = fileSystem.hierarchy.getFile(activeFileId);
  const activeFileAncestors = activeFile.getAncestors();
  const currentFile = fileSystem.hierarchy.getFile(fileId)

  const expandable = item.type == "folder" || !item.type;

  useEffect(() => {
    if (activeFileAncestors.includes(item.id)) {
      setCollapsed(false);
    }
  }, [activeFile]);

  async function onMove(destination) {
    if (currentFile.movableTo(destination)) {
      activateContextMenu(false);
      await fileSystem.moveFile(fileId, destination.id);
      rerender();
    }
  }

  return (
    <div>
      <div
        className={style.item}
        style={
          !fileId && item.id == activeFileId
            ? {
                color: "var(--color-active-high)",
              }
            : {}
        }
        onClick={() =>
          fileId ? onMove(item) : router.push(`/drive/${item.id}`)
        }
        onContextMenu={(e) => {
          e.preventDefault();
          activateContextMenu(true, {
            type: "hierarchy",
            data: item,
          });
        }}
      >
        <div
          className={style.itemHead}
          style={{
            transform: `translateX(${
              0.9 * depth + (!expandable ? 0.5 : 0)
            }rem)`,
          }}
        >
          {expandable && (
            <div className={style.arrowHead}>
              <svg
                style={{
                  transform: collapsed ? "rotate(0deg)" : "rotate(90deg)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCollapsed((collapsed) => !collapsed);
                }}
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Layer_2" data-name="Layer 2">
                  <g id="invisible_box" data-name="invisible box">
                    <rect width="48" height="48" fill="none" />
                  </g>
                  <g id="icons_Q2" data-name="icons Q2">
                    <path d="M27.2,24,16.6,34.6a1.9,1.9,0,0,0,.2,3,2.1,2.1,0,0,0,2.7-.2l11.9-12a1.9,1.9,0,0,0,0-2.8l-11.9-12a2.1,2.1,0,0,0-2.7-.2,1.9,1.9,0,0,0-.2,3Z" />
                  </g>
                </g>
              </svg>
            </div>
          )}

          <span className={style.itemName}>{item.name}</span>
        </div>
      </div>
      {expandable && (
        <div
          className={style.children}
          style={{
            height: collapsed ? 0 : "auto",
          }}
        >
          {item
            .getChildren()
            .filter((child) => child.type == "folder")
            .map((child) => (
              <HierarchyItem
                key={child.id}
                item={child}
                depth={depth + 1}
                fileId={fileId}
              />
            ))}

          {!fileId &&
            item
              .getChildren()
              .filter((child) => child.type == "file")
              .map((child) => (
                <HierarchyItem
                  key={child.id}
                  item={child}
                  depth={depth + 1}
                  fileId={fileId}
                />
              ))}
        </div>
      )}
    </div>
  );
}

export default function Hierarchy({ fileId }) {
  const [fileSystem] = useBundlrState((state) => [state.fileSystem]);
  let root = fileSystem.hierarchy.getFile("root");
  return (
    <div className={style.hierarchy}>
      <HierarchyItem item={root} depth={0} fileId={fileId} />
    </div>
  );
}
