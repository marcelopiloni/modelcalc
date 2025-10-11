// Project Management Functions
let currentProjects = [];
let currentClients = [];

// Load projects
async function loadProjects() {
    try {
        const response = await fetch('/api/projects', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            currentProjects = result.data || [];
            displayProjects();
            updateProjectSelect();
        } else {
            alert('Erro ao carregar projetos');
        }
    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        alert('Erro ao carregar projetos');
    }
}

// Display projects in table
function displayProjects() {
    const tableBody = document.getElementById('projects-table-body');
    tableBody.innerHTML = '';
    
    if (currentProjects.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum projeto encontrado</td></tr>';
        return;
    }
    
    currentProjects.forEach(project => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${project.name}</td>
            <td>${project.description}</td>
            <td>${project.client ? project.client.name : 'N/A'}</td>
            <td>
                <span class="status status-${project.status}">
                    ${project.status === 'active' ? 'Ativo' : 
                      project.status === 'completed' ? 'Concluído' : 'Cancelado'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary edit-project-btn" data-project-id="${project._id}">Editar</button>
                <button class="btn btn-sm btn-danger delete-project-btn" data-project-id="${project._id}">Excluir</button>
            </td>
        `;
        
        // Add event listeners to buttons in this row
        const editBtn = row.querySelector('.edit-project-btn');
        const deleteBtn = row.querySelector('.delete-project-btn');
        
        editBtn.addEventListener('click', () => editProject(project._id));
        deleteBtn.addEventListener('click', () => deleteProject(project._id));
        
        tableBody.appendChild(row);
    });
}

// Update project select in budget form
function updateProjectSelect() {
    const projectSelect = document.getElementById('budget-project');
    if (!projectSelect) return; // Elemento pode não existir na página atual
    
    projectSelect.innerHTML = '<option value="">Selecione um projeto</option>';
    
    if (Array.isArray(currentProjects)) {
        currentProjects.forEach(project => {
            if (project.status === 'active') {
                const option = document.createElement('option');
                option.value = project._id;
                option.textContent = project.name;
                projectSelect.appendChild(option);
            }
        });
    }
}

// Load clients for project form
async function loadClients() {
    try {
        const response = await fetch('/api/auth', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const users = await response.json();
            currentClients = (Array.isArray(users) ? users : users.data || []).filter(user => user.userType === 'client');
            updateClientSelect();
        } else {
            alert('Erro ao carregar clientes');
        }
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
    }
}

// Update client select in project form
function updateClientSelect() {
    const clientSelect = document.getElementById('project-client');
    if (!clientSelect) return; // Elemento pode não existir na página atual
    
    clientSelect.innerHTML = '<option value="">Selecione um cliente</option>';
    
    if (Array.isArray(currentClients)) {
        currentClients.forEach(client => {
            const option = document.createElement('option');
            option.value = client._id;
            option.textContent = client.name;
            clientSelect.appendChild(option);
        });
    }
}

// Show new project form
function showNewProject() {
    document.getElementById('project-form-title').textContent = 'Novo Projeto';
    document.getElementById('project-form').reset();
    document.getElementById('project-id').value = '';
    showSection('project-form-section');
}

// Expose globally immediately
window.showNewProject = showNewProject;

// Edit project
function editProject(projectId) {
    const project = currentProjects.find(p => p._id === projectId);
    if (!project) return;
    
    document.getElementById('project-form-title').textContent = 'Editar Projeto';
    document.getElementById('project-id').value = project._id;
    document.getElementById('project-name').value = project.name;
    document.getElementById('project-description').value = project.description;
    document.getElementById('project-client').value = project.client ? project.client._id : '';
    document.getElementById('project-status').value = project.status;
    
    showSection('project-form-section');
}

// Expose globally immediately
window.editProject = editProject;

// Delete project
async function deleteProject(projectId) {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/projects/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            alert('Projeto excluído com sucesso!');
            loadProjects();
        } else {
            alert('Erro ao excluir projeto');
        }
    } catch (error) {
        console.error('Erro ao excluir projeto:', error);
        alert('Erro ao excluir projeto');
    }
}

// Expose globally immediately
window.deleteProject = deleteProject;

// Handle project form submit
document.getElementById('project-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const projectId = document.getElementById('project-id').value;
    const projectData = {
        name: document.getElementById('project-name').value,
        description: document.getElementById('project-description').value,
        clientId: document.getElementById('project-client').value,
        status: document.getElementById('project-status').value
    };
    
    try {
        const url = projectId ? `/api/projects/${projectId}` : '/api/projects';
        const method = projectId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        });
        
        if (response.ok) {
            alert(projectId ? 'Projeto atualizado com sucesso!' : 'Projeto criado com sucesso!');
            showSection('projects-section');
            loadProjects();
        } else {
            alert('Erro ao salvar projeto');
        }
    } catch (error) {
        console.error('Erro ao salvar projeto:', error);
        alert('Erro ao salvar projeto');
    }
});

// Cancel project form
document.getElementById('cancel-project-btn').addEventListener('click', () => {
    showSection('projects-section');
});

// Initialize projects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('token')) {
        loadProjects();
        loadClients();
    }
});

// Additional global exposures
window.loadProjects = loadProjects;