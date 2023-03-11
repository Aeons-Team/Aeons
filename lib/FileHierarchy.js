class FileHierarchyNode {
  constructor(id, data) {
    this.id = id;
    Object.assign(this, data);
  }

  getAncestors() {
    let ancestors = [];
    let node = this;

    do {
      ancestors.push(node.id);
      node = node.parent;
    } while (node && node.id != "root");

    return ancestors;
  }

  getChildren() {
    let children = [];
    let node = this.firstChild;

    while (node) {
      children.push(node);
      node = node.next;
    }

    return children;
  }
}

class FileHierarchyTree {
  constructor() {
    this.nodes = {};
  }

  insert(id, parentId, data) {
    if (!(id in this.nodes)) {
      this.nodes[id] = new FileHierarchyNode(id, data);
    }

    let node = this.nodes[id];
    node.prev = node.next = null;

    if (parentId) {
      const parentNode = this.nodes[parentId];
      node.parent = parentNode;

      if (parentNode.lastChild) {
        parentNode.lastChild.next = node;
        node.prev = parentNode.lastChild;
        parentNode.lastChild = node;
      } else {
        parentNode.firstChild = parentNode.lastChild = node;
      }
    }
  }

  remove(id) {
    let node = this.nodes[id];

    let parentNode = node.parent;

    if (node == parentNode.firstChild) {
      parentNode.firstChild = node.next;
    }

    if (node == parentNode.lastChild) {
      parentNode.lastChild = node.prev;
    }

    if (node.prev) {
      node.prev.next = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    }
  }

  move(id, parentId) {
    this.remove(id);
    this.insert(id, parentId);
  }
  rename(id, name) {
    this.nodes[id].name = name;
  }
}

export default class FileHierarchy {
  constructor(transactions) {
    this.tree = new FileHierarchyTree();

    this.tree.insert("root", null, {
      id: "root",
      name: "root",
    });

    for (const tx of transactions) {
      this.addFromTransaction(tx);
    }
  }

  addFromTransaction(tx) {
    if (["file", "folder", "drive"].includes(tx.tags.type)) {
      let parent = tx.tags.parent ?? "root";
      let data = {
        name:
          tx.tags.name ?? `untitled.${tx.tags["Content-Type"]?.split("/")[1]}`,
        type: tx.tags.type,
        size: tx.size,
        pending: tx.pending,
        contentType: tx.tags["Content-Type"],
      };

      this.tree.insert(tx.id, parent, data);
    } else if (tx.tags.type == "move")
      this.tree.move(tx.tags.file, tx.tags.destination);
    else if (tx.tags.type == "rename")
      this.tree.rename(tx.tags.file, tx.tags.newName);
  }

  getFile(id) {
    return this.tree.nodes[id];
  }
}
