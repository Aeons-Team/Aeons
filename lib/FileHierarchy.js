export default class FileHierarchy {
  constructor(transactions) {
    this.files = {
      "root": {
        name: "root",
        id: "root",
        children: []
      }
    };
    
    this.parentOf = {};

    for (const tx of transactions) {
      this.addFromTransaction(tx);
    }
  }

  addFromTransaction(tx) {
    if (["file", "folder", "drive"].includes(tx.tags.type)) {
      if (!(tx.id in this.files)) {
        this.files[tx.id] = {};

        if (tx.tags.type != "file") {
          this.files[tx.id].children = [];
        }
      }

      const file = this.files[tx.id];

      Object.assign(file, {
        id: tx.id,
        name:
          tx.tags.name ?? `untitled.${tx.tags["Content-Type"]?.split("/")[1]}`,
        type: tx.tags.type,
        size: tx.size,
        pending: tx.pending,
        contentType: tx.tags["Content-Type"],
      });

      const parentId = tx.tags.parent ?? "root";

      if (!(parentId in this.files)) {
        this.files[parentId] = {
          children: [],
        };
      }

      let parent = this.files[parentId];
      parent.children.push(file);

      this.parentOf[file.id] = parentId;
    }
  }

  getFiles() {
    let filesList = [];
    for (const obj of Object.values(this.files)) filesList.push(obj);
    return filesList;
  }

  getFile(id) {
    return this.files[id];
  }

  getChildren(id) {
    return this.files[id].children;
  }

  getAncestor(id) {
    return this.parentOf[id];
  }

  getAncestors(id) {
    const ancestors = [id];
    id = this.parentOf[id];
    ancestors.push(id);

    return ancestors;
  }
}
