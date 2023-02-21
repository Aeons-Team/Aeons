export default class Transaction {
  constructor(tx) {
    this.id = tx.id; 
    this.tags = {};

    for (let { name, value } of tx.tags) {      
      this.tags[name] = value;
    }
  }
}