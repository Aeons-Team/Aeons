export default class PendingTransactions {
  constructor() {    
    const transactionsJson = localStorage.getItem('pendingTransactions') ?? '[]';

    this.transactions = JSON.parse(transactionsJson);
    this.indexOf = {};
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
    localStorage.setItem('pendingTransactions', JSON.stringify(this.transactions));
  }
}