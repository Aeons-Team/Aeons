export default class PendingTransactions {
  constructor(address) {
    this.address = address    
    
    const transactionsJson = localStorage.getItem(`pendingTransactions-${this.address}`) ?? '[]';
    this.transactions = JSON.parse(transactionsJson);
  }

  removeTransactions(transactions) {
    const filterIds = transactions.map(tx => tx.id)
    this.transactions = this.transactions.filter(tx => !filterIds.includes(tx.id))
    this.saveTransactions();
  }

  addTransaction(tx) {    
    this.transactions.push(tx);
    this.saveTransactions();
  }

  saveTransactions() {
    localStorage.setItem(`pendingTransactions-${this.address}`, JSON.stringify(this.transactions));
  }
}