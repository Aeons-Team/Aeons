export default class Transaction {
  constructor(tx) {
    this.id = tx.id; 
    this.tags = {};
    this.size = tx.data?.size;

    for (let { name, value } of tx.tags) {      
      this.tags[name] = value;
    }
  }
}