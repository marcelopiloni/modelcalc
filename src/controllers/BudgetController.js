const Budget = require('../models/Budget');
const { v4: uuidv4 } = require('uuid');

class BudgetController {
  async downloadBudgetExcel(req, res) {
    try {
      const { id } = req.params;
      const budget = this.budgets.get(id);
      if (!budget) {
        return res.status(404).json({
          status: 'error',
          message: 'Orçamento não encontrado'
        });
      }
      const { budgetToExcel } = require('../utils/excelExport');
      const buffer = await budgetToExcel(budget.toJSON());
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=orcamento_${id}.xlsx`);
      res.send(buffer);
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Erro ao gerar Excel do orçamento',
        error: error.message
      });
    }
  }
  constructor() {
    this.budgets = new Map(); // In-memory storage (substituir por banco de dados)
  }

  async createBudget(req, res) {
    try {
      const budgetData = {
        id: uuidv4(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const budget = new Budget(budgetData);
      this.budgets.set(budget.id, budget);

      res.status(201).json({
        status: 'success',
        message: 'Orçamento criado com sucesso',
        data: budget.toJSON()
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: 'Erro ao criar orçamento',
        error: error.message
      });
    }
  }

  async getAllBudgets(req, res) {
    try {
      const budgets = Array.from(this.budgets.values()).map(budget => budget.toJSON());
      
      res.status(200).json({
        status: 'success',
        results: budgets.length,
        data: budgets
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar orçamentos',
        error: error.message
      });
    }
  }

  async getBudgetById(req, res) {
    try {
      const { id } = req.params;
      const budget = this.budgets.get(id);

      if (!budget) {
        return res.status(404).json({
          status: 'error',
          message: 'Orçamento não encontrado'
        });
      }

      res.status(200).json({
        status: 'success',
        data: budget.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar orçamento',
        error: error.message
      });
    }
  }

  async updateBudget(req, res) {
    try {
      const { id } = req.params;
      const budget = this.budgets.get(id);

      if (!budget) {
        return res.status(404).json({
          status: 'error',
          message: 'Orçamento não encontrado'
        });
      }

      // Update budget properties
      Object.keys(req.body).forEach(key => {
        if (budget.hasOwnProperty(key)) {
          budget[key] = req.body[key];
        }
      });

      budget.updatedAt = new Date();
      budget.calculateTotalCost();

      res.status(200).json({
        status: 'success',
        message: 'Orçamento atualizado com sucesso',
        data: budget.toJSON()
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: 'Erro ao atualizar orçamento',
        error: error.message
      });
    }
  }

  async deleteBudget(req, res) {
    try {
      const { id } = req.params;
      
      if (!this.budgets.has(id)) {
        return res.status(404).json({
          status: 'error',
          message: 'Orçamento não encontrado'
        });
      }

      this.budgets.delete(id);

      res.status(200).json({
        status: 'success',
        message: 'Orçamento excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Erro ao excluir orçamento',
        error: error.message
      });
    }
  }

  async addMaterial(req, res) {
    try {
      const { id } = req.params;
      const budget = this.budgets.get(id);

      if (!budget) {
        return res.status(404).json({
          status: 'error',
          message: 'Orçamento não encontrado'
        });
      }

      budget.addMaterial(req.body);

      res.status(200).json({
        status: 'success',
        message: 'Material adicionado com sucesso',
        data: budget.toJSON()
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: 'Erro ao adicionar material',
        error: error.message
      });
    }
  }

  async addProcess(req, res) {
    try {
      const { id } = req.params;
      const budget = this.budgets.get(id);

      if (!budget) {
        return res.status(404).json({
          status: 'error',
          message: 'Orçamento não encontrado'
        });
      }

      budget.addProcess(req.body);

      res.status(200).json({
        status: 'success',
        message: 'Processo adicionado com sucesso',
        data: budget.toJSON()
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: 'Erro ao adicionar processo',
        error: error.message
      });
    }
  }

  async calculateBudget(req, res) {
    try {
      const { id } = req.params;
      const budget = this.budgets.get(id);

      if (!budget) {
        return res.status(404).json({
          status: 'error',
          message: 'Orçamento não encontrado'
        });
      }

      budget.calculateTotalCost();

      res.status(200).json({
        status: 'success',
        message: 'Orçamento calculado com sucesso',
        data: {
          costs: {
            labor: budget.laborCost,
            material: budget.materialCost,
            processing: budget.processingCost,
            total: budget.totalCost
          },
          pricing: {
            margin: budget.margin,
            finalPrice: budget.finalPrice
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Erro ao calcular orçamento',
        error: error.message
      });
    }
  }
}

module.exports = new BudgetController();