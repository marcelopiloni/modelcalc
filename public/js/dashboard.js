// Dashboard Management Functions
let dashboardData = {
    projects: [],
    budgets: [],
    materials: [],
    files: []
};

// Load dashboard data
async function loadDashboard() {
    try {
        await Promise.all([
            loadDashboardStats(),
            loadRecentBudgets(),
            loadActiveProjects()
        ]);
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        showAlert('Erro ao carregar dados do dashboard');
    }
}

// Load statistics
async function loadDashboardStats() {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // Load projects count
        const projectsResponse = await fetch('/api/projects', { headers });
        if (projectsResponse.ok) {
            const projectsData = await projectsResponse.json();
            const activeProjects = projectsData.data.filter(p => p.status === 'active');
            document.getElementById('total-projects').textContent = activeProjects.length;
            dashboardData.projects = projectsData.data;
        }

        // Load budgets count
        const budgetsResponse = await fetch('/api/budgets', { headers });
        if (budgetsResponse.ok) {
            const budgetsData = await budgetsResponse.json();
            document.getElementById('total-budgets').textContent = budgetsData.data.length;
            dashboardData.budgets = budgetsData.data;
        }

        // Load materials count
        const materialsResponse = await fetch('/api/materials', { headers });
        if (materialsResponse.ok) {
            const materialsData = await materialsResponse.json();
            const materials = materialsData.data || materialsData;
            document.getElementById('total-materials').textContent = materials.length;
            dashboardData.materials = materials;
        }

        // Load files count
        const filesResponse = await fetch('/api/files', { headers });
        if (filesResponse.ok) {
            const filesData = await filesResponse.json();
            const files = filesData.data || [];
            document.getElementById('total-files').textContent = files.length;
            dashboardData.files = files;
        }

    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// Load recent budgets
async function loadRecentBudgets() {
    const container = document.getElementById('recent-budgets');
    
    if (!dashboardData.budgets || dashboardData.budgets.length === 0) {
        container.innerHTML = '<p class="text-muted">Nenhum orçamento encontrado</p>';
        return;
    }

    // Get 5 most recent budgets
    const recentBudgets = dashboardData.budgets
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    container.innerHTML = '';
    recentBudgets.forEach(budget => {
        const item = document.createElement('div');
        item.className = 'recent-item';
        
        const projectName = budget.projectId?.name || 'Projeto não informado';
        const clientName = budget.clientId?.name || 'Cliente não informado';
        const finalPrice = budget.finalPrice || 0;
        
        item.innerHTML = `
            <div>
                <div class="recent-item-title">${projectName}</div>
                <div class="recent-item-subtitle">${clientName}</div>
            </div>
            <div class="recent-item-value">R$ ${finalPrice.toFixed(2)}</div>
        `;
        
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            viewBudget(budget._id);
        });
        
        container.appendChild(item);
    });
}

// Load active projects
async function loadActiveProjects() {
    const container = document.getElementById('active-projects');
    
    if (!dashboardData.projects || dashboardData.projects.length === 0) {
        container.innerHTML = '<p class="text-muted">Nenhum projeto encontrado</p>';
        return;
    }

    // Get active projects
    const activeProjects = dashboardData.projects
        .filter(p => p.status === 'active')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    if (activeProjects.length === 0) {
        container.innerHTML = '<p class="text-muted">Nenhum projeto ativo</p>';
        return;
    }

    container.innerHTML = '';
    activeProjects.forEach(project => {
        const item = document.createElement('div');
        item.className = 'recent-item';
        
        const clientName = project.client?.name || 'Cliente não informado';
        const createdDate = new Date(project.createdAt).toLocaleDateString('pt-BR');
        
        item.innerHTML = `
            <div>
                <div class="recent-item-title">${project.name}</div>
                <div class="recent-item-subtitle">${clientName} - ${createdDate}</div>
            </div>
        `;
        
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            editProject(project._id);
        });
        
        container.appendChild(item);
    });
}

// Initialize dashboard
function initializeDashboard() {
    // Check if user is authenticated
    if (!localStorage.getItem('token')) {
        return;
    }

    loadDashboard();
    
    // Auto-refresh every 5 minutes
    setInterval(loadDashboard, 5 * 60 * 1000);
}

// Expose dashboard functions globally
window.loadDashboard = loadDashboard;
window.initializeDashboard = initializeDashboard;

// Setup dashboard event listeners
function setupDashboardEventListeners() {
    // View all buttons
    const viewAllBudgetsBtn = document.getElementById('view-all-budgets-btn');
    const viewAllProjectsBtn = document.getElementById('view-all-projects-btn');
    
    if (viewAllBudgetsBtn) {
        viewAllBudgetsBtn.addEventListener('click', () => {
            showSection('budgets-section');
            loadBudgets();
        });
    }
    
    if (viewAllProjectsBtn) {
        viewAllProjectsBtn.addEventListener('click', () => {
            showSection('projects-section');
            loadProjects();
        });
    }
    
    // Quick action buttons - Conditional based on RBAC
    const newBudgetBtn = document.getElementById('new-budget-dashboard-btn');
    const newProjectBtn = document.getElementById('new-project-dashboard-btn');
    const newMaterialBtn = document.getElementById('new-material-dashboard-btn');
    const uploadCADBtn = document.getElementById('upload-cad-dashboard-btn');
    
    // Only managers and operators can create budgets
    if (newBudgetBtn) {
        if (auth.isManagerOrOperator()) {
            newBudgetBtn.addEventListener('click', () => {
                showSection('budget-form-section');
                loadProjectsInSelect();
                loadMaterialsForBudget();
            });
        } else {
            newBudgetBtn.style.display = 'none';
        }
    }
    
    // Only managers and operators can create projects
    if (newProjectBtn) {
        if (auth.isManagerOrOperator()) {
            newProjectBtn.addEventListener('click', () => {
                showNewProject();
            });
        } else {
            newProjectBtn.style.display = 'none';
        }
    }
    
    // Only managers and operators can create materials
    if (newMaterialBtn) {
        if (auth.isManagerOrOperator()) {
            newMaterialBtn.addEventListener('click', () => {
                showNewMaterial();
            });
        } else {
            newMaterialBtn.style.display = 'none';
        }
    }
    
    // All authenticated users can upload CAD files
    if (uploadCADBtn) {
        uploadCADBtn.addEventListener('click', () => {
            showUploadCADForm();
        });
    }
}

// Load dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('token')) {
        setTimeout(() => {
            initializeDashboard();
            setupDashboardEventListeners();
        }, 1000); // Wait for other modules to load
    }
});