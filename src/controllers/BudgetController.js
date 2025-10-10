const Budget = require('../models/Budget');
const Project = require('../models/Project');
const CADFile = require('../models/CADFile');

class BudgetController {
    async downloadBudgetExcel(req, res) {
        try {
            const { id } = req.params;
            const budget = await Budget.findById(id)
                .populate('projectId')
                .populate('clientId')
                .populate('cadFiles');
                
            if (!budget) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Orçamento não encontrado'
                });
            }

            // Verificar permissão
            if (req.user.userType === 'client' && budget.clientId.toString() !== req.user.userId) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Acesso não autorizado'
                });
            }

            const { budgetToExcel } = require('../utils/excelExport');
            const buffer = await budgetToExcel(budget);
            
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

    async createBudget(req, res) {
        try {
            // Verificar se o projeto existe
            const project = await Project.findById(req.body.projectId);
            if (!project) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Projeto não encontrado'
                });
            }

            const budget = new Budget({
                ...req.body,
                createdBy: req.user.userId
            });

            await budget.save();

            res.status(201).json({
                status: 'success',
                message: 'Orçamento criado com sucesso',
                data: budget
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
            let query = {};
            
            // Se for cliente, mostrar apenas seus orçamentos
            if (req.user.userType === 'client') {
                query.clientId = req.user.userId;
            }

            const budgets = await Budget.find(query)
                .populate('projectId')
                .populate('clientId')
                .populate('createdBy')
                .sort('-createdAt');

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
            const budget = await Budget.findById(req.params.id)
                .populate('projectId')
                .populate('clientId')
                .populate('cadFiles')
                .populate('createdBy');

            if (!budget) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Orçamento não encontrado'
                });
            }

            // Verificar permissão
            if (req.user.userType === 'client' && budget.clientId.toString() !== req.user.userId) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Acesso não autorizado'
                });
            }

            res.status(200).json({
                status: 'success',
                data: budget
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
            const budget = await Budget.findById(req.params.id);

            if (!budget) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Orçamento não encontrado'
                });
            }

            // Verificar permissão
            if (req.user.userType === 'client') {
                return res.status(403).json({
                    status: 'error',
                    message: 'Acesso não autorizado'
                });
            }

            // Atualizar orçamento
            Object.assign(budget, req.body);
            await budget.save();

            res.status(200).json({
                status: 'success',
                message: 'Orçamento atualizado com sucesso',
                data: budget
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
            const budget = await Budget.findById(req.params.id);

            if (!budget) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Orçamento não encontrado'
                });
            }

            // Verificar permissão
            if (req.user.userType === 'client') {
                return res.status(403).json({
                    status: 'error',
                    message: 'Acesso não autorizado'
                });
            }

            await budget.remove();

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
            const budget = await Budget.findById(req.params.id);

            if (!budget) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Orçamento não encontrado'
                });
            }

            // Verificar permissão
            if (req.user.userType === 'client') {
                return res.status(403).json({
                    status: 'error',
                    message: 'Acesso não autorizado'
                });
            }

            await budget.addMaterial(req.body);

            res.status(200).json({
                status: 'success',
                message: 'Material adicionado com sucesso',
                data: budget
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
            const budget = await Budget.findById(req.params.id);

            if (!budget) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Orçamento não encontrado'
                });
            }

            // Verificar permissão
            if (req.user.userType === 'client') {
                return res.status(403).json({
                    status: 'error',
                    message: 'Acesso não autorizado'
                });
            }

            await budget.addProcess(req.body);

            res.status(200).json({
                status: 'success',
                message: 'Processo adicionado com sucesso',
                data: budget
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: 'Erro ao adicionar processo',
                error: error.message
            });
        }
    }
}

module.exports = new BudgetController();