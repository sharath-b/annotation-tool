class Base {
  constructor() {
    this.model = null;
  }

  seed(amount = 1, options = {}) {
    const recordsSet = [];
    for (let i = 0; i < amount; i++) {
      recordsSet.push(this.createRecord(options));
    }

    return Promise.all(
      recordsSet.map(u => this.model.create(u))
    ).then(results => {
      if (options.returnInputData) {
        return recordsSet.length === 1 ? recordsSet[0] : recordsSet;
      }

      return results.length === 1 ? results[0] : results;
    });
  }

  createRecord() {
    throw new Error('Not implemented');
  }
}

module.exports = Base;
