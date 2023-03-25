export interface ContractFile {
    id: string,
    content_type: string,
    size?: number,
    parent_id?: string,
    name: string,
    children?: string[]
}

export interface ContractStateData {
    hierarchy: {
        files: { [id: string]: ContractFile }
    }

    owner: String
}

export default class ContractState {
    data: ContractStateData

    constructor(data: ContractStateData) {
        this.data = data
    }

    getFiles(): { [id: string]: ContractFile } {
        return this.data.hierarchy.files
    }

    getFile(id: string): ContractFile {
        return this.data.hierarchy.files[id]
    }

    getChildren(id: string): ContractFile[] | undefined {
        return this.getFile(id).children?.map(childId => this.getFile(childId))
    }

    isRelocatable(fileId: string, destinationId: string): boolean {
        if (fileId == destinationId) return false

        const file = this.getFile(fileId)
        return destinationId != file.parent_id
    }
}