import { create } from "zustand";
import { shallow } from "zustand/shallow";
import Vector2 from "../lib/Vector2";
import { ContractFile } from '../lib/ContractState'

interface ContextMenuOpts {
  type?: string,
  copy?: boolean,
  file?: ContractFile
}

interface AppStoreData {
  cursorPosition: Vector2, 
  contextMenuActivated: boolean,
  contextMenuOpts: ContextMenuOpts,
  contextMenuPosition: Vector2,
  selected: { [id: string]: boolean },
  activateContextMenu: (flag: boolean, opts: ContextMenuOpts) => void
  select: (item: string) => void,
  clearSelection: (item: string) => void,
  getSelection: () => string[]
}

export const useAppStore = create<AppStoreData>((set, get) => ({
  cursorPosition: new Vector2(),
  contextMenuActivated: false,
  contextMenuOpts: {},
  contextMenuPosition: new Vector2(),
  selected: {},

  activateContextMenu: (flag: boolean, opts: ContextMenuOpts) => {
    const { cursorPosition, contextMenuPosition } = get();
    const partial: any = { contextMenuActivated: flag };

    if (flag) {
      contextMenuPosition.copy(cursorPosition);
      partial.contextMenuOpts = opts;
    } else partial.contextMenuOpts = {};

    set(partial);
  },

  select: (item: string) => {
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

export const useAppState = (selector: (state: AppStoreData) => AppStoreData) => useAppStore<AppStoreData>(selector, shallow);
