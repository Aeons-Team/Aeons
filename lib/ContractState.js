export default class ContractState {
    constructor(instance) {
        this.instance = instance   
    }

    getFiles() {
        return this.instance.hierarchy.files
    }

    getFile(id) {
        return this.instance.hierarchy.files[id]
    }

    getChildren(id) {
        return this.getFile(id).children.map(childId => this.getFile(childId))
    }

    isRelocatable(fileId, destinationId) {
        if (fileId == destinationId) return false

        const file = this.getFile(fileId);
        return destinationId != file.parent_id
    }
}