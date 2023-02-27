export default class Transaction {
  constructor(tx) {
    this.id = tx.id;
    this.tags = {};
    this.pending = tx.pending;

    if (tx.data?.size) {
      this.size = Number(tx.data.size);
    }

    for (let { name, value } of tx.tags) {
      this.tags[name] = value;
    }
  }
}
