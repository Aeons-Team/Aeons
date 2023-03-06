import { create } from "zustand";
import { shallow } from "zustand/shallow";
import Vector2 from "../lib/Vector2";

export const useAppStore = create((set, get) => ({
  cursorPosition: new Vector2(),
  contextMenuActivated: false,
  contextMenuOpts: {},
  contextMenuPosition: new Vector2(),
  activateContextMenu: (flag, opts) => {
    const { cursorPosition, contextMenuPosition } = get();
    const partial = { contextMenuActivated: flag };

    if (flag) {
      contextMenuPosition.copy(cursorPosition);
      partial.contextMenuOpts = opts;
    } else partial.contextMenuOpts = {};

    set(partial);
  },
}));

export const useAppState = (func) => useAppStore(func, shallow);
