class Project {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.clientName = data.clientName;
    this.clientEmail = data.clientEmail;
    this.status = data.status || 'active'; // active, completed, cancelled
    this.budgets = data.budgets || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  addBudget(budgetId) {
    this.budgets.push(budgetId);
    this.updatedAt = new Date();
  }

  removeBudget(budgetId) {
    this.budgets = this.budgets.filter(id => id !== budgetId);
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      client: {
        name: this.clientName,
        email: this.clientEmail
      },
      status: this.status,
      budgets: this.budgets,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Project;