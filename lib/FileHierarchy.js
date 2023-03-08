export default class FileHierarchy {
  constructor(transactions) {
    this.files = {
      root: {
        name: "root",
        id: "root",
        children: [],
      },
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

      let parent = this.files[parentId];
      parent.children.push(file);
      this.parentOf[file.id] = parentId;
    } else if (tx.tags.type === "move") {
      let oldParent = this.files[this.parentOf[tx.tags.file]];
      oldParent.children = oldParent.children.filter(
        (x) => x.id != tx.tags.file
      );
      let newParent = this.files[tx.tags.destination];
      newParent.children.push(this.files[tx.tags.file]);
      this.parentOf[tx.tags.file] = tx.tags.destination;
    } else if (tx.tags.type === "rename") {
      this.files[tx.tags.file].name = tx.tags.newName;
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
