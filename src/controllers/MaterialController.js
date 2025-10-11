const Material = require('../models/Material');

class MaterialController {
    async createMaterial(req, res) {
        try {
            const material = new Material({
                ...req.body,
                createdBy: req.user.userId
            });

            await material.save();
            await material.populate('createdBy', 'name email');

            res.status(201).json({
                status: 'success',
                message: 'Material criado com sucesso',
                data: material
            });
        } catch (error) {
            console.error('Erro ao criar material:', error);
            res.status(400).json({
                status: 'error',
                message: 'Erro ao criar material',
                error: error.message
            });
        }
    }

    async getAllMaterials(req, res) {
        try {
            const materials = await Material.find({ active: true })
                .populate('createdBy', 'name email')
                .sort('-createdAt');

            res.json({
                status: 'success',
                results: materials.length,
                data: materials
            });
        } catch (error) {
            console.error('Erro ao buscar materiais:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar materiais',
                error: error.message
            });
        }
    }

    async getMaterialById(req, res) {
        try {
            const material = await Material.findById(req.params.id)
                .populate('createdBy', 'name email');

            if (!material) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Material não encontrado'
                });
            }

            res.json({
                status: 'success',
                data: material
            });
        } catch (error) {
            console.error('Erro ao buscar material:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar material',
                error: error.message
            });
        }
    }

    async updateMaterial(req, res) {
        try {
            const material = await Material.findById(req.params.id);

            if (!material) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Material não encontrado'
                });
            }

            // Verificar permissão
            if (req.user.userType === 'client') {
                return res.status(403).json({
                    status: 'error',
                    message: 'Acesso não autorizado'
                });
            }

            Object.assign(material, req.body);
            await material.save();
            await material.populate('createdBy', 'name email');

            res.json({
                status: 'success',
                message: 'Material atualizado com sucesso',
                data: material
            });
        } catch (error) {
            console.error('Erro ao atualizar material:', error);
            res.status(400).json({
                status: 'error',
                message: 'Erro ao atualizar material',
                error: error.message
            });
        }
    }

    async deleteMaterial(req, res) {
        try {
            const material = await Material.findById(req.params.id);

            if (!material) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Material não encontrado'
                });
            }

            // Verificar permissão
            if (req.user.userType === 'client') {
                return res.status(403).json({
                    status: 'error',
                    message: 'Acesso não autorizado'
                });
            }

            // Soft delete - apenas marcar como inativo
            material.active = false;
            await material.save();

            res.json({
                status: 'success',
                message: 'Material removido com sucesso'
            });
        } catch (error) {
            console.error('Erro ao remover material:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro ao remover material',
                error: error.message
            });
        }
    }
}

module.exports = new MaterialController();
