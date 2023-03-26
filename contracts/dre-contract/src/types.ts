export interface ContractAction {
    input: ContractInput
    caller: string
}

interface InsertData {
    id: string,
    contentType: string,
    size: number,
    parentId: string,
    name: string,
}

interface RelocateData {
    ids: string[],
    oldParentId: string,
    newParentId: string
}

interface RenameData {
    newName: string
}

interface EvolveData {
    value: string
}

export interface ContractInput extends InsertData, RelocateData, RenameData, EvolveData {
    function: 'insert' | 'relocate' | 'rename' | 'evolve',
}

export interface ContractFile {
    id: string,
    contentType: string,
    size?: number,
    parentId?: string,
    name: string,
    children: string[]
}

export interface ContractState {
    hierarchy: {
        files: { [id: string]: { [id: string]: ContractFile } }
    },
    owner: string,
    canEvolve: boolean,
    evolve: string | null
}

export interface ContractResult {
    state: ContractState
}