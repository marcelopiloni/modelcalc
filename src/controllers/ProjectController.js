const Project = require('../models/Project');
const User = require('../models/User');

class ProjectController {
    async createProject(req, res) {
        try {
            const project = new Project({
                ...req.body,
                createdBy: req.user.userId
            });

            await project.save();
            await project.populate(['clientId', 'createdBy']);

            res.status(201).json({
                status: 'success',
                message: 'Projeto criado com sucesso',
                data: project
            });
        } catch (error) {
            console.error('Erro ao criar projeto:', error);
            res.status(400).json({
                status: 'error',
                message: 'Erro ao criar projeto',
                error: error.message
            });
        }
    }

    async getAllProjects(req, res) {
        try {
            let query = {};
            
            // Se for cliente, mostrar apenas seus projetos
            if (req.user.userType === 'client') {
                query.clientId = req.user.userId;
            }

            const projects = await Project.find(query)
                .populate('clientId', 'name email company')
                .populate('createdBy', 'name email')
                .sort('-createdAt');

            res.status(200).json({
                status: 'success',
                results: projects.length,
                data: projects
            });
        } catch (error) {
            console.error('Erro ao buscar projetos:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar projetos',
                error: error.message
            });
        }
    }

    async getProjectById(req, res) {
        try {
            const project = await Project.findById(req.params.id)
                .populate('clientId', 'name email company')
                .populate('createdBy', 'name email');

            if (!project) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Projeto não encontrado'
                });
            }

            // Verificar permissão
            if (req.user.userType === 'client' && project.clientId._id.toString() !== req.user.userId) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Acesso não autorizado'
                });
            }

            res.status(200).json({
                status: 'success',
                data: project
            });
        } catch (error) {
            console.error('Erro ao buscar projeto:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar projeto',
                error: error.message
            });
        }
    }

    async updateProject(req, res) {
        try {
            const project = await Project.findById(req.params.id);

            if (!project) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Projeto não encontrado'
                });
            }

            // Verificar permissão
            if (req.user.userType === 'client') {
                return res.status(403).json({
                    status: 'error',
                    message: 'Acesso não autorizado'
                });
            }

            Object.assign(project, req.body);
            await project.save();
            await project.populate(['clientId', 'createdBy']);

            res.status(200).json({
                status: 'success',
                message: 'Projeto atualizado com sucesso',
                data: project
            });
        } catch (error) {
            console.error('Erro ao atualizar projeto:', error);
            res.status(400).json({
                status: 'error',
                message: 'Erro ao atualizar projeto',
                error: error.message
            });
        }
    }

    async deleteProject(req, res) {
        try {
            const project = await Project.findById(req.params.id);
            
            if (!project) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Projeto não encontrado'
                });
            }

            // Verificar permissão
            if (req.user.userType === 'client') {
                return res.status(403).json({
                    status: 'error',
                    message: 'Acesso não autorizado'
                });
            }

            await project.deleteOne();

            res.status(200).json({
                status: 'success',
                message: 'Projeto excluído com sucesso'
            });
        } catch (error) {
            console.error('Erro ao excluir projeto:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro ao excluir projeto',
                error: error.message
            });
        }
    }
}

module.exports = new ProjectController();