import { create } from "zustand";
import { shallow } from "zustand/shallow";
import Vector2 from "../lib/Vector2";

export const useAppStore = create((set, get) => ({
  cursorPosition: new Vector2(),
  contextMenuActivated: false,
  contextMenuOpts: {},
  contextMenuPosition: new Vector2(),
  selected: {},

  activateContextMenu: (flag, opts) => {
    const { cursorPosition, contextMenuPosition } = get();
    const partial = { contextMenuActivated: flag };

    if (flag) {
      contextMenuPosition.copy(cursorPosition);
      partial.contextMenuOpts = opts;
    } else partial.contextMenuOpts = {};

    set(partial);
  },

  select: (item) => {
    const selected = get().selected 
    set({ selected: { ...selected, [item]: !selected[item] } })
  },

  clearSelection: () => {
    set({ selected: {} })
  },

  getSelection: () => {
    const selected = get().selected
    return Object.keys(selected).filter(x => selected[x])
  }
}));

export const useAppState = (func) => useAppStore(func, shallow);
