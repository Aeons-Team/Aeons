export interface ContractFile {
    id: string,
    contentType: string,
    size?: number,
    parentId?: string,
    name: string,
    children?: string[],
    createdAt?: number,
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

    searchFiles(searchVal: string): ContractFile[] {
        const files = this.getData().hierarchy.files
        const searchList: ContractFile[] = []

        for (const file of Object.values(files)) {
            if (file.name == 'root') continue

            file.name.toLowerCase().includes(searchVal.trim().toLowerCase()) &&
                searchList.push(file)
        }

        return searchList
    }

    getChildren(id: string): ContractFile[] | undefined {
        return this.getFile(id).children?.map(childId => this.getFile(childId))
    }

    isRelocatable(fileId: string, destinationId: string): boolean {
        if (fileId == destinationId) return false

        const file = this.getFile(fileId)
        const destination = this.getFile(destinationId)

        if(destination.contentType != 'folder') return false 
        return destinationId != file.parentId
    }
}