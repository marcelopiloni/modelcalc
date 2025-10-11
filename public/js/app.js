// Gerenciamento da interface
document.addEventListener('DOMContentLoaded', () => {
    // Referencias aos elementos
    const sections = {
        login: document.getElementById('login-section'),
        register: document.getElementById('register-section'),
        budgets: document.getElementById('budgets-section'),
        budgetForm: document.getElementById('budget-form-section')
    };

    const navLinks = {
        home: document.getElementById('nav-home'),
        projects: document.getElementById('nav-projects'),
        budgets: document.getElementById('nav-budgets'),
        materials: document.getElementById('nav-materials'),
        files: document.getElementById('nav-files'),
        users: document.getElementById('nav-users'),
        logout: document.getElementById('nav-logout')
    };

    const forms = {
        login: document.getElementById('login-form'),
        register: document.getElementById('register-form'),
        budget: document.getElementById('budget-form')
    };

    // Funções auxiliares
    window.showSection = function(sectionId) {
        // Get all sections
        const allSections = document.querySelectorAll('main > div[id$="-section"]');
        allSections.forEach(section => section.classList.add('hidden'));
        
        // Show the requested section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
    }

    window.showAlert = function(message, type = 'error') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        document.querySelector('.container').insertBefore(alert, document.querySelector('.container').firstChild);
        
        setTimeout(() => alert.remove(), 5000);
    }

    function updateNavigation() {
        if (auth.isAuthenticated()) {
            Object.values(navLinks).forEach(link => {
                if (link) link.classList.remove('hidden');
            });
            
            // Ocultar link de usuários para não-gerentes
            if (navLinks.users && !auth.isManager()) {
                navLinks.users.classList.add('hidden');
            }
            
            // Mostrar informações do usuário com badge de função
            const userInfoEl = document.getElementById('user-info');
            const roleName = auth.getRoleName();
            const roleBadgeClass = auth.isManager() ? 'badge-manager' : 
                                   auth.isOperator() ? 'badge-operator' : 'badge-client';
            
            userInfoEl.innerHTML = `
                ${auth.user.name}
                <span class="user-role-badge ${roleBadgeClass}">${roleName}</span>
            `;
            userInfoEl.classList.remove('hidden');
            
            // Verificar se usuário está aprovado
            if (!auth.isApproved()) {
                showApprovalPendingMessage();
            } else {
                showSection('dashboard-section');
                if (typeof loadDashboard === 'function') {
                    loadDashboard();
                }
            }
        } else {
            Object.values(navLinks).forEach(link => {
                if (link) link.classList.add('hidden');
            });
            document.getElementById('user-info').classList.add('hidden');
            showSection('login-section');
        }
    }
    
    function showApprovalPendingMessage() {
        const dashboardSection = document.getElementById('dashboard-section');
        dashboardSection.innerHTML = `
            <div class="approval-message">
                <div class="approval-message-icon">⏳</div>
                <div class="approval-message-content">
                    <h3>Aguardando Aprovação</h3>
                    <p>Seu cadastro está pendente de aprovação por um gerente. Você será notificado assim que for aprovado.</p>
                </div>
            </div>
        `;
        dashboardSection.classList.remove('hidden');
    }

    // Demais inicializações continuam abaixo...

    // Event Listeners
    forms.login.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await auth.login(
                document.getElementById('login-email').value,
                document.getElementById('login-password').value
            );
            updateNavigation();
        } catch (error) {
            showAlert(error.message);
        }
    });

    forms.register.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const role = document.getElementById('register-role').value;
            await auth.register({
                name: document.getElementById('register-name').value,
                email: document.getElementById('register-email').value,
                password: document.getElementById('register-password').value,
                company: document.getElementById('register-company').value,
                userType: document.getElementById('register-type').value,
                role: role
            });
            
            // Mostrar mensagem apropriada baseado na função
            if (role === 'operator') {
                showAlert('Cadastro realizado! Aguarde aprovação do gerente para acessar o sistema.', 'success');
            } else {
                showAlert('Cadastro realizado com sucesso!', 'success');
            }
            
            updateNavigation();
        } catch (error) {
            showAlert(error.message);
        }
    });

    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('register-section');
    });

    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('login-section');
    });

    navLinks.logout.addEventListener('click', (e) => {
        e.preventDefault();
        auth.logout();
    });

    document.getElementById('new-budget-btn').addEventListener('click', async () => {
        forms.budget.reset();
        document.getElementById('budget-id').value = '';
        document.getElementById('budget-form-title').textContent = 'Novo Orçamento';
        
        // Limpar materiais e processos existentes
        clearBudgetItems();
        
        // Limpar seleção de arquivos CAD
        if (typeof clearCADSelection === 'function') {
            clearCADSelection();
        }
        
        // Carregar projetos no select
        await loadProjectsInSelect();
        
        // Carregar materiais para uso nos dropdowns
        await loadMaterialsForBudget();
        
        showSection('budget-form-section');
    });

    document.getElementById('cancel-budget-btn').addEventListener('click', () => {
        showSection('budgets-section');
    });

    forms.budget.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const materials = [];
            const processes = [];

            // Coletar materiais
            document.querySelectorAll('.material-row').forEach(row => {
                const materialSelect = row.querySelector('.material-select');
                const quantityInput = row.querySelector('.quantity-input');
                const costInput = row.querySelector('.unit-cost-input');
                
                if (materialSelect && quantityInput && costInput && 
                    materialSelect.value && quantityInput.value && costInput.value) {
                    
                    const selectedOption = materialSelect.selectedOptions[0];
                    const materialName = selectedOption ? selectedOption.textContent.split(' - ')[0] : 'Material';
                    
                    materials.push({
                        materialId: materialSelect.value,
                        name: materialName,
                        quantity: parseFloat(quantityInput.value),
                        unitCost: parseFloat(costInput.value)
                    });
                }
            });

            // Coletar processos
            document.querySelectorAll('.process-row').forEach(row => {
                const nameInput = row.querySelector('.process-name');
                const durationInput = row.querySelector('.process-duration');
                const costInput = row.querySelector('.process-cost');
                
                if (nameInput && durationInput && costInput && 
                    nameInput.value && durationInput.value && costInput.value) {
                    processes.push({
                        name: nameInput.value,
                        duration: parseFloat(durationInput.value),
                        hourlyRate: parseFloat(costInput.value)
                    });
                }
            });

            // Verificar se os elementos existem antes de acessar suas propriedades
            const projectSelect = document.getElementById('budget-project');
            const descriptionTextarea = document.getElementById('budget-description');
            const laborCostInput = document.getElementById('budget-labor-cost');
            const marginInput = document.getElementById('budget-margin');
            
            if (!projectSelect || !descriptionTextarea || !laborCostInput || !marginInput) {
                throw new Error('Elementos do formulário não encontrados');
            }
            
            if (!projectSelect.value) {
                throw new Error('Por favor, selecione um projeto');
            }
            
            if (!descriptionTextarea.value.trim()) {
                throw new Error('Por favor, preencha a descrição do orçamento');
            }

            const budgetData = {
                projectId: projectSelect.value,
                clientId: projectSelect.selectedOptions[0]?.dataset.clientId || auth.user.id,
                description: descriptionTextarea.value.trim(),
                materials: materials,
                processes: processes,
                laborCost: parseFloat(laborCostInput.value) || 0,
                margin: parseFloat(marginInput.value) || 0
            };

            await budgets.create(budgetData);
            showAlert('Orçamento criado com sucesso!', 'success');
            showSection('budgets-section');
            loadBudgets();
        } catch (error) {
            showAlert('Erro ao criar orçamento: ' + error.message);
        }
    });

    // Adicionar material
    document.getElementById('add-material-btn').addEventListener('click', () => {
        addMaterialRow();
    });

    // Adicionar processo
    document.getElementById('add-process-btn').addEventListener('click', () => {
        addProcessRow();
    });

    // Inicialização
    if (auth.initAuth()) {
        updateNavigation();
    } else {
        showSection('login-section');
    }
});

// Estado global para orçamentos carregados
let currentBudgets = [];

// Gerenciamento de orçamentos
async function loadBudgets() {
    try {
        console.log('Loading budgets...');
        const budgetsList = await budgets.list();
        currentBudgets = Array.isArray(budgetsList) ? budgetsList : [];
        window.currentBudgets = currentBudgets;

        console.log('Budgets loaded:', currentBudgets.length);

        const tbody = document.getElementById('budgets-table-body');

        if (!tbody) {
            console.error('Elemento budgets-table-body não encontrado');
            return;
        }

        tbody.innerHTML = '';

        if (currentBudgets.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td colspan="5" class="text-center">Nenhum orçamento encontrado</td>
            `;
            tbody.appendChild(tr);
            console.log('No budgets found, showing empty message');
            return;
        }

        currentBudgets.forEach(budget => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${budget.clientId?.name || 'Cliente não informado'}</td>
                <td>${budget.projectId?.name || 'Projeto não informado'}</td>
                <td>R$ ${(budget.finalPrice || 0).toFixed(2)}</td>
                <td>${budget.status || 'Status não definido'}</td>
                <td>
                    <button class="btn btn-primary btn-sm view-budget-btn" data-budget-id="${budget._id}">Ver</button>
                    ${auth.isSupplier() ? `
                        <button class="btn btn-danger btn-sm delete-budget-btn" data-budget-id="${budget._id}">Excluir</button>
                    ` : ''}
                    <button class="btn btn-success btn-sm excel-budget-btn" data-budget-id="${budget._id}">Excel</button>
                    <button class="btn btn-secondary btn-sm pdf-budget-btn" data-budget-id="${budget._id}">PDF</button>
                </td>
            `;

            const viewBtn = tr.querySelector('.view-budget-btn');
            const deleteBtn = tr.querySelector('.delete-budget-btn');
            const excelBtn = tr.querySelector('.excel-budget-btn');
            const pdfBtn = tr.querySelector('.pdf-budget-btn');

            viewBtn.addEventListener('click', () => viewBudget(budget._id));
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => deleteBudget(budget._id));
            }
            excelBtn.addEventListener('click', () => downloadExcel(budget._id));
            if (pdfBtn) {
                pdfBtn.addEventListener('click', () => downloadPDF(budget._id));
            }

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar orçamentos:', error);
        showAlert(error.message || 'Erro ao carregar orçamentos');
    }
}

// Funções para carregar dados
async function loadProjectsInSelect() {
    try {
        const select = document.getElementById('budget-project');
        if (!select) {
            console.error('Elemento budget-project não encontrado');
            return;
        }
        
        const projectsList = await projects.list();
        select.innerHTML = '<option value="">Selecione um projeto</option>';
        
        if (!projectsList || projectsList.length === 0) {
            select.innerHTML += '<option value="" disabled>Nenhum projeto disponível</option>';
            return;
        }
        
        projectsList.forEach(project => {
            const option = document.createElement('option');
            option.value = project._id;
            option.textContent = `${project.name} - ${project.client?.name || project.clientId?.name || 'Cliente não informado'}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        showAlert('Erro ao carregar projetos: ' + error.message);
    }
}

// Funções para gerenciar materiais
// Função para carregar materiais para uso nos orçamentos
async function loadMaterialsForBudget() {
    try {
        if (typeof loadMaterials === 'function') {
            await loadMaterials();
        }
    } catch (error) {
        console.error('Erro ao carregar materiais para orçamento:', error);
        showAlert('Erro ao carregar materiais: ' + error.message);
    }
}

async function addMaterialRow() {
    // Garantir que os materiais estão carregados
    if (!window.currentMaterials || window.currentMaterials.length === 0) {
        try {
            await loadMaterials();
        } catch (error) {
            console.error('Erro ao carregar materiais:', error);
            showAlert('Erro ao carregar materiais cadastrados');
            return;
        }
    }
    
    const container = document.getElementById('materials-list');
    const row = document.createElement('div');
    row.className = 'material-row';
    row.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px; align-items: center;';
    
    // Criar select com materiais cadastrados
    let materialOptions = '<option value="">Selecione um material</option>';
    if (window.currentMaterials && window.currentMaterials.length > 0) {
        window.currentMaterials.forEach(material => {
            materialOptions += `<option value="${material._id}" data-cost="${material.unitCost}" data-unit="${material.unit}">
                ${material.name} - ${material.category} (${material.unit}) - R$ ${material.unitCost.toFixed(2)}
            </option>`;
        });
    }
    
    row.innerHTML = `
        <select class="material-select" required style="flex: 2;">
            ${materialOptions}
        </select>
        <input type="number" class="quantity-input" placeholder="Quantidade" min="0.01" step="0.01" required style="flex: 1;">
        <input type="number" class="unit-cost-input" placeholder="Custo unitário" min="0" step="0.01" required style="flex: 1;">
        <span class="unit-label" style="flex: 0.5; font-size: 0.9em;"></span>
        <button type="button" class="remove-material-btn btn btn-danger" style="padding: 5px 10px;">X</button>
    `;
    
    // Adicionar event listeners após criar o elemento
    const materialSelect = row.querySelector('.material-select');
    const removeBtn = row.querySelector('.remove-material-btn');
    
    materialSelect.addEventListener('change', function() {
        updateMaterialCost(this);
    });
    
    removeBtn.addEventListener('click', function() {
        row.remove();
    });
    
    container.appendChild(row);
}

// Função para atualizar custo do material selecionado
function updateMaterialCost(selectElement) {
    const selectedOption = selectElement.selectedOptions[0];
    if (selectedOption && selectedOption.value) {
        const cost = selectedOption.getAttribute('data-cost');
        const unit = selectedOption.getAttribute('data-unit');
        
        const row = selectElement.parentElement;
        const costInput = row.querySelector('.unit-cost-input');
        const unitLabel = row.querySelector('.unit-label');
        
        if (costInput && cost) {
            costInput.value = parseFloat(cost).toFixed(2);
        }
        if (unitLabel && unit) {
            unitLabel.textContent = unit;
        }
    } else {
        // Limpar campos quando nenhum material for selecionado
        const row = selectElement.parentElement;
        const costInput = row.querySelector('.unit-cost-input');
        const unitLabel = row.querySelector('.unit-label');
        
        if (costInput) costInput.value = '';
        if (unitLabel) unitLabel.textContent = '';
    }
}

// Expor função globalmente
window.updateMaterialCost = updateMaterialCost;

// Função para limpar todos os materiais e processos
function clearBudgetItems() {
    const materialsContainer = document.getElementById('materials-list');
    const processesContainer = document.getElementById('processes-list');
    
    if (materialsContainer) materialsContainer.innerHTML = '';
    if (processesContainer) processesContainer.innerHTML = '';
}

// Expor função globalmente
window.clearBudgetItems = clearBudgetItems;

// Funções para gerenciar processos
function addProcessRow() {
    const container = document.getElementById('processes-list');
    const row = document.createElement('div');
    row.className = 'process-row';
    row.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px; align-items: center;';
    
    row.innerHTML = `
        <input type="text" class="process-name" placeholder="Nome do processo" required style="flex: 2;">
        <input type="number" class="process-duration" placeholder="Duração (horas)" min="0.1" step="0.1" required style="flex: 1;">
        <input type="number" class="process-cost" placeholder="Custo/hora" min="0" step="0.01" required style="flex: 1;">
        <button type="button" class="remove-process-btn btn btn-danger" style="padding: 5px 10px;">X</button>
    `;
    
    // Adicionar event listener para o botão de remoção
    const removeBtn = row.querySelector('.remove-process-btn');
    removeBtn.addEventListener('click', function() {
        row.remove();
    });
    
    container.appendChild(row);
}

// Funções globais para interação com a tabela
function viewBudget(id) {
    const budget = currentBudgets.find(b => b._id === id);
    if (!budget) return;
    
    // Preencher o formulário para edição
    document.getElementById('budget-form-title').textContent = 'Editar Orçamento';
    document.getElementById('budget-id').value = budget._id;
    document.getElementById('budget-description').value = budget.description || '';
    document.getElementById('budget-labor-cost').value = budget.laborCost || 0;
    document.getElementById('budget-margin').value = budget.margin || 0;
    
    // Selecionar projeto
    const projectSelect = document.getElementById('budget-project');
    if (projectSelect && budget.projectId) {
        projectSelect.value = budget.projectId._id || budget.projectId;
    }
    
    // Limpar listas atuais
    document.getElementById('materials-list').innerHTML = '';
    document.getElementById('processes-list').innerHTML = '';
    
    // Carregar materiais existentes
    if (budget.materials && budget.materials.length > 0) {
        budget.materials.forEach(material => {
            addMaterialRow(material);
        });
    }
    
    // Carregar processos existentes
    if (budget.processes && budget.processes.length > 0) {
        budget.processes.forEach(process => {
            addProcessRow(process);
        });
    }
    
    showSection('budget-form-section');
}

function deleteBudget(id) {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
        budgets.delete(id).then(() => {
            loadBudgets();
        }).catch(error => {
            showAlert(error.message);
        });
    }
}

function downloadExcel(id) {
    if (window.budgets && window.budgets.downloadExcel) {
        window.budgets.downloadExcel(id);
    } else {
        showAlert('Erro: Módulo de orçamentos não carregado corretamente');
    }
}

function downloadPDF(id) {
    if (window.budgets && window.budgets.downloadPDF) {
        window.budgets.downloadPDF(id);
    } else {
        showAlert('Erro: Módulo de orçamentos não carregado corretamente');
    }
}

// Global function to check authentication
window.isAuthenticated = function() {
    return localStorage.getItem('token') !== null;
}

// Expose loadBudgets globally
window.loadBudgets = loadBudgets;

// Navigation for Budgets
document.getElementById('nav-budgets').addEventListener('click', () => {
    if (isAuthenticated()) {
        showSection('budgets-section');
        loadBudgets();
    }
});

// Navigation for Projects
document.getElementById('nav-projects').addEventListener('click', () => {
    if (isAuthenticated()) {
        showSection('projects-section');
        loadProjects();
    }
});

// Navigation for Materials
document.getElementById('nav-materials').addEventListener('click', () => {
    if (isAuthenticated()) {
        showSection('materials-section');
        loadMaterials();
    }
});

// Project new button
document.getElementById('new-project-btn').addEventListener('click', () => {
    showNewProject();
});

// Material new button
document.getElementById('new-material-btn').addEventListener('click', () => {
    showNewMaterial();
});

// Navigation for Files
document.getElementById('nav-files').addEventListener('click', () => {
    if (isAuthenticated()) {
        showSection('files-section');
        loadCADFiles();
    }
});

// Navigation for Home/Dashboard
document.getElementById('nav-home').addEventListener('click', () => {
    if (isAuthenticated()) {
        showSection('dashboard-section');
        loadDashboard();
    }
});

// Navigation for Users (Manager only)
document.getElementById('nav-users').addEventListener('click', () => {
    if (isAuthenticated() && auth.isManager()) {
        showSection('user-management-section');
        if (typeof showUserManagement === 'function') {
            showUserManagement();
        }
    }
});

// Check authentication and load data when page loads
function initializeApp() {
    if (auth.isAuthenticated()) {
        updateNavigation();
        // Pre-load data for better user experience
        setTimeout(() => {
            loadBudgets();
            if (typeof loadProjects === 'function') loadProjects();
            if (typeof loadMaterials === 'function') loadMaterials();
            if (typeof loadCADFiles === 'function') loadCADFiles();
        }, 500);
    } else {
        updateNavigation();
    }
}

// Initialize app when DOM is loaded
setTimeout(initializeApp, 100);