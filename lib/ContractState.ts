export interface ContractFile {
    id: string,
    contentType: string,
    size?: number,
    parentId?: string,
    name: string,
    children?: string[],
    pending: boolean
}

export interface ContractStateData {
    hierarchy: {
        files: { [id: string]: ContractFile }
    }

    owner: string,
    internalOwner?: string,
    canEvolve: boolean
    evolve?: string
}

export default class ContractState {
    data: ContractStateData | undefined

    constructor(data?: ContractStateData) {
        this.data = data
    }

    setData(data: ContractStateData) {
        this.data = data
    }

    getData() : ContractStateData {
        if (!this.data) throw new Error()

        return this.data
    }

    copy() {
        return new ContractState(this.data)
    }

    getFiles(): { [id: string]: ContractFile } {
        if (!this.data) throw new Error()

        return this.data.hierarchy.files
    }

    getFile(id: string): ContractFile {
        if (!this.data) throw new Error()

        return this.data.hierarchy.files[id]
    }

    getChildren(id: string): ContractFile[] | undefined {
        return this.getFile(id).children?.map(childId => this.getFile(childId))
    }

    isRelocatable(fileId: string, destinationId: string): boolean {
        if (fileId == destinationId) return false

        const file = this.getFile(fileId)
        return destinationId != file.parentId
    }
}