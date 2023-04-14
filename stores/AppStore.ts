import { create } from "zustand";
import { shallow } from "zustand/shallow";
import Vector2 from "../lib/Vector2";
import { ContractFile } from '../lib/ContractState'

interface ContextMenuOpts {
  type?: string
  file?: ContractFile
  action?: string
}

interface AppStoreData {
  cursorPosition: Vector2, 
  contextMenuActivated: boolean,
  contextMenuOpts: ContextMenuOpts,
  contextMenuPosition: Vector2,
  selected: { [id: string]: boolean },
  holdingShift: boolean,
  holdingControl: boolean,
  firstSelected: string | null,
  showWallet: boolean,
  searchActivated: boolean,
  contextMenuAction: string,
  contextMenuActivation: number,
  dragCount: number,
  beingDragged: { [id: string]: number },
  resourceCache: { [id: string]: string },
  activateContextMenu: (flag: boolean, opts: ContextMenuOpts) => void
  select: (item: string) => void,
  selectItems: (items: string[]) => void,
  clearSelection: (clearFirstSelected: boolean) => void,
  getSelection: () => string[],
  setShowWallet: (value: boolean) => void,
  setDragging: (id: string, value: boolean) => void,
  clearDragging: Function,
  funding: boolean,
  setFunding: Function,
  errorMessage: string,
  setErrorMessage: Function,
}

export const useAppStore = create<AppStoreData>((set, get) => ({
  cursorPosition: new Vector2(),
  contextMenuActivated: false,
  contextMenuOpts: {},
  contextMenuPosition: new Vector2(),
  selected: {},
  holdingShift: false,
  holdingControl: false,
  firstSelected: null,
  showWallet: false,
  searchActivated: false,
  contextMenuAction: '',
  contextMenuActivation: 0,
  dragCount: 0,
  beingDragged: {},
  funding: false,
  resourceCache: {},
  setFunding: (value: boolean) => set({ funding: value }),
  errorMessage: '',
  setErrorMessage: (error: string) => set({ errorMessage: error }),

  activateContextMenu: (flag: boolean, opts: ContextMenuOpts) => {
    const { cursorPosition, contextMenuPosition, contextMenuActivation } = get();
    const partial: any = { contextMenuActivated: flag };

    const explorerFiles = document.querySelector('#explorer-files')

    if (!explorerFiles) throw new Error()

    const explorerFilesBB = explorerFiles.getBoundingClientRect()
    const { left, top } = explorerFilesBB

    if (flag) {
      contextMenuPosition.copy(cursorPosition.sub(left, top - explorerFiles.scrollTop - 2));
      partial.contextMenuOpts = { type: opts.type, file: opts.file };
      partial.contextMenuAction = opts.action;
    } 
    
    else {
      partial.contextMenuOpts = {};
      partial.contextMenuAction = ''
    }

    partial.contextMenuActivation = contextMenuActivation + 1;

    set(partial);
  },

  select: (item: string) => {
    const { selected, firstSelected } = get()
    selected[item] = !selected[item]

    set({ selected: { ...selected }, firstSelected: firstSelected || item })
  },

  selectItems: (items: string[]) => {
    const selected = get().selected 
        
    items.forEach(item => selected[item] = true)

    set({ selected: { ...selected }})
  },

  clearSelection: (clearFirstSelected: boolean = true) => {
    const { selected } = get()
    const partial: any = {}

    if (clearFirstSelected) {
      partial.firstSelected = null
    }

    if (Object.keys(selected).length) {
      partial.selected = {}
    }
    
    set(partial)
  },

  getSelection: () => {
    const selected = get().selected
    return Object.keys(selected).filter(x => selected[x])
  },

  setShowWallet: (value: boolean) => {
    set({ showWallet: value })
  },

  setDragging: (id: string) => {
    let { beingDragged, dragCount } = get()    
    ++dragCount

    set({ beingDragged: { ...beingDragged, [id]: dragCount }, dragCount })
  },

  clearDragging: () => {
    set({ beingDragged: {}, dragCount: 0 })
  },

  cacheResource: (key: string, url: string) => {
    const { resourceCache } = get() 

    set({ resourceCache: { ...resourceCache, [key]: url } })
  }
}));

export const useAppState = (selector: (state: AppStoreData) => AppStoreData) => useAppStore<AppStoreData>(selector, shallow);
