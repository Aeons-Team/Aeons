(() => {
  // contract.js
  function handle(state, { input }) {
    if (input.type == "insert") {
      state.files.push(input.id);
    }
    return { state };
  }
})();
