// Gerenciamento de projetos
const projects = {
    async list() {
        try {
            const response = await fetch('/api/projects', {
                headers: auth.getHeaders()
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao listar projetos');
            }

            return data.data;
        } catch (error) {
            console.error('Erro ao listar projetos:', error);
            throw error;
        }
    },

    async create(projectData) {
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: auth.getHeaders(),
                body: JSON.stringify(projectData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao criar projeto');
            }

            return data.data;
        } catch (error) {
            console.error('Erro ao criar projeto:', error);
            throw error;
        }
    }
};

// Gerenciamento de materiais
const materials = {
    async list() {
        try {
            const response = await fetch('/api/materials', {
                headers: auth.getHeaders()
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao listar materiais');
            }

            return data.data;
        } catch (error) {
            console.error('Erro ao listar materiais:', error);
            throw error;
        }
    },

    async create(materialData) {
        try {
            const response = await fetch('/api/materials', {
                method: 'POST',
                headers: auth.getHeaders(),
                body: JSON.stringify(materialData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao criar material');
            }

            return data.data;
        } catch (error) {
            console.error('Erro ao criar material:', error);
            throw error;
        }
    }
};

// Gerenciamento de orçamentos
const budgets = {
    async list() {
        try {
            const response = await fetch('/api/budgets', {
                headers: auth.getHeaders()
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao listar orçamentos');
            }

            return data.data;
        } catch (error) {
            console.error('Erro ao listar orçamentos:', error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await fetch(`/api/budgets/${id}`, {
                headers: auth.getHeaders()
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao buscar orçamento');
            }

            return data.data;
        } catch (error) {
            console.error('Erro ao buscar orçamento:', error);
            throw error;
        }
    },

    async create(budgetData) {
        try {
            const response = await fetch('/api/budgets', {
                method: 'POST',
                headers: auth.getHeaders(),
                body: JSON.stringify(budgetData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao criar orçamento');
            }

            return data.data;
        } catch (error) {
            console.error('Erro ao criar orçamento:', error);
            throw error;
        }
    },

    async update(id, budgetData) {
        try {
            const response = await fetch(`/api/budgets/${id}`, {
                method: 'PUT',
                headers: auth.getHeaders(),
                body: JSON.stringify(budgetData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao atualizar orçamento');
            }

            return data.data;
        } catch (error) {
            console.error('Erro ao atualizar orçamento:', error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const response = await fetch(`/api/budgets/${id}`, {
                method: 'DELETE',
                headers: auth.getHeaders()
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao excluir orçamento');
            }

            return true;
        } catch (error) {
            console.error('Erro ao excluir orçamento:', error);
            throw error;
        }
    },

    async addMaterial(id, materialData) {
        try {
            const response = await fetch(`/api/budgets/${id}/materials`, {
                method: 'POST',
                headers: auth.getHeaders(),
                body: JSON.stringify(materialData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao adicionar material');
            }

            return data.data;
        } catch (error) {
            console.error('Erro ao adicionar material:', error);
            throw error;
        }
    },

    async addProcess(id, processData) {
        try {
            const response = await fetch(`/api/budgets/${id}/processes`, {
                method: 'POST',
                headers: auth.getHeaders(),
                body: JSON.stringify(processData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao adicionar processo');
            }

            return data.data;
        } catch (error) {
            console.error('Erro ao adicionar processo:', error);
            throw error;
        }
    },

    downloadExcel(id) {
        const token = auth.token;
        window.open(`/api/budgets/${id}/excel?token=${token}`, '_blank');
    }
};

// Function to load projects in select dropdown
async function loadProjectsInSelect() {
    try {
        const projectsList = await projects.list();
        const projectSelect = document.getElementById('budget-project');
        
        projectSelect.innerHTML = '<option value="">Selecione um projeto</option>';
        
        projectsList.forEach(project => {
            if (project.status === 'active') {
                const option = document.createElement('option');
                option.value = project._id;
                option.textContent = project.name;
                projectSelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
    }
}