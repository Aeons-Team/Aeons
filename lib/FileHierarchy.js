export default class FileHierarchy {
  constructor(transactions) {
    this.files = {};
    this.parentOf = {};

    for (const tx of transactions) {
      this.addFromTransaction(tx)
    }
  }

  addFromTransaction(tx) {
    if (['file', 'folder'].includes(tx.tags.type)) {
      if (!(tx.id in this.files)) {
        this.files[tx.id] = {}

        if (tx.tags.type == 'folder') {
          this.files[tx.id].children = []
        }
      }

      const file = this.files[tx.id]
      
      Object.assign(file, {
        id: tx.id,
        name: tx.tags.name,
        type: tx.tags.type,
        contentType: tx.tags['Content-Type']
      })

      const parentId = tx.tags.parent ?? 'root'

      if (!(parentId in this.files)) {
        this.files[parentId] = {
          children: []
        }
      }

      let parent = this.files[parentId]
      parent.children.push(file)

      this.parentOf[file.id] = parentId
    }
  }

  getFile(id) {
    return this.files[id]
  }

  getChildren(id) {
    return this.files[id].children
  }

  getAncestors(id) {
    const ancestors = []

    while (id != 'root') {
      id = this.parentOf[id]
      ancestors.push(id)
    }

    return ancestors
  }
}