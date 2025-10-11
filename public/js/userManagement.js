// User Management for Managers and Admin
let pendingUsers = [];
let allUsers = [];

/**
 * Create new user (Admin only)
 */
async function createNewUser(userData) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/auth/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            showAlert(`Usuário ${userData.role} criado com sucesso!`, 'success');
            // Recarregar lista de usuários
            await loadAllUsers();
            return true;
        } else {
            showAlert(result.message || 'Erro ao criar usuário', 'error');
            return false;
        }
    } catch (error) {
        console.error('Error creating user:', error);
        showAlert('Erro ao criar usuário: ' + error.message, 'error');
        return false;
    }
}

// Load pending users for approval
async function loadPendingUsers() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/auth/pending', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            pendingUsers = result.data || [];
            displayPendingUsers();
        } else {
            console.error('Failed to load pending users');
        }
    } catch (error) {
        console.error('Error loading pending users:', error);
    }
}

// Display pending users
function displayPendingUsers() {
    const container = document.getElementById('pending-users-list');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (pendingUsers.length === 0) {
        container.innerHTML = '<p class="text-muted">Nenhum usuário pendente de aprovação</p>';
        return;
    }
    
    pendingUsers.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card pending';
        
        const createdDate = new Date(user.createdAt).toLocaleDateString('pt-BR');
        
        userCard.innerHTML = `
            <div class="user-card-header">
                <div class="user-info">
                    <h4>${user.name}</h4>
                    <p class="text-muted">${user.email}</p>
                </div>
                <span class="badge badge-warning">Pendente</span>
            </div>
            <div class="user-card-body">
                <div class="user-detail">
                    <strong>Empresa:</strong> ${user.company || 'Não informado'}
                </div>
                <div class="user-detail">
                    <strong>Tipo:</strong> ${user.userType === 'client' ? 'Cliente' : 'Fornecedor'}
                </div>
                <div class="user-detail">
                    <strong>Role Solicitada:</strong> ${getRoleName(user.role)}
                </div>
                <div class="user-detail">
                    <strong>Cadastrado em:</strong> ${createdDate}
                </div>
            </div>
            <div class="user-card-actions">
                <select id="role-select-${user._id}" class="form-control" style="display: inline-block; width: auto; margin-right: 10px;">
                    <option value="operator" ${user.role === 'operator' ? 'selected' : ''}>Operador</option>
                    <option value="manager" ${user.role === 'manager' ? 'selected' : ''}>Gerente</option>
                    <option value="client" ${user.role === 'client' ? 'selected' : ''}>Cliente</option>
                </select>
                <button class="btn btn-success btn-sm" onclick="approveUser('${user._id}', true)">
                    ✓ Aprovar
                </button>
                <button class="btn btn-danger btn-sm" onclick="approveUser('${user._id}', false)">
                    ✗ Rejeitar
                </button>
            </div>
        `;
        
        container.appendChild(userCard);
    });
}

// Approve or reject user
async function approveUser(userId, approved) {
    try {
        const roleSelect = document.getElementById(`role-select-${userId}`);
        const selectedRole = roleSelect ? roleSelect.value : null;
        
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/auth/${userId}/approve`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                approved: approved,
                role: selectedRole
            })
        });

        const result = await response.json();
        
        if (response.ok) {
            showAlert(result.message, 'success');
            loadPendingUsers(); // Reload list
            if (typeof loadAllUsers === 'function') {
                loadAllUsers(); // Reload all users if function exists
            }
        } else {
            showAlert(result.message || 'Erro ao processar aprovação', 'error');
        }
    } catch (error) {
        console.error('Error approving user:', error);
        showAlert('Erro ao processar aprovação', 'error');
    }
}

// Load all users (for managers)
async function loadAllUsers() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/auth/', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            allUsers = result.data || result || [];
            displayAllUsers();
        } else {
            console.error('Failed to load all users');
        }
    } catch (error) {
        console.error('Error loading all users:', error);
    }
}

// Display all users
function displayAllUsers() {
    const tableBody = document.getElementById('all-users-table-body');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (allUsers.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6" class="text-center">Nenhum usuário encontrado</td>';
        tableBody.appendChild(row);
        return;
    }
    
    allUsers.forEach(user => {
        const row = document.createElement('tr');
        
        const statusBadge = user.approved 
            ? '<span class="badge badge-success">Aprovado</span>' 
            : '<span class="badge badge-warning">Pendente</span>';
            
        const activeBadge = user.active 
            ? '<span class="badge badge-success">Ativo</span>' 
            : '<span class="badge badge-danger">Inativo</span>';
        
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.company || '-'}</td>
            <td>${getRoleName(user.role)}</td>
            <td>${statusBadge} ${activeBadge}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="showEditUserModal('${user._id}')">
                    Editar Role
                </button>
                <button class="btn btn-${user.active ? 'warning' : 'success'} btn-sm" onclick="toggleUserStatus('${user._id}')">
                    ${user.active ? 'Desativar' : 'Ativar'}
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Toggle user active status
async function toggleUserStatus(userId) {
    if (!confirm('Tem certeza que deseja alterar o status deste usuário?')) {
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/auth/${userId}/toggle-status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        
        if (response.ok) {
            showAlert(result.message, 'success');
            loadAllUsers();
        } else {
            showAlert(result.message || 'Erro ao alterar status', 'error');
        }
    } catch (error) {
        console.error('Error toggling user status:', error);
        showAlert('Erro ao alterar status do usuário', 'error');
    }
}

// Show edit user role modal
function showEditUserModal(userId) {
    const user = allUsers.find(u => u._id === userId);
    if (!user) return;
    
    const newRole = prompt(
        `Alterar role de ${user.name}\n\nRole atual: ${getRoleName(user.role)}\n\nDigite a nova role:\n- manager (Gerente)\n- operator (Operador)\n- client (Cliente)`,
        user.role
    );
    
    if (newRole && ['manager', 'operator', 'client'].includes(newRole)) {
        updateUserRole(userId, newRole);
    } else if (newRole) {
        showAlert('Role inválida. Use: manager, operator ou client', 'error');
    }
}

// Update user role
async function updateUserRole(userId, role) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/auth/${userId}/role`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role })
        });

        const result = await response.json();
        
        if (response.ok) {
            showAlert(result.message, 'success');
            loadAllUsers();
        } else {
            showAlert(result.message || 'Erro ao atualizar role', 'error');
        }
    } catch (error) {
        console.error('Error updating user role:', error);
        showAlert('Erro ao atualizar role do usuário', 'error');
    }
}

// Helper function
function getRoleName(role) {
    const roleNames = {
        'admin': 'Administrador',
        'manager': 'Gerente',
        'operator': 'Operador',
        'client': 'Cliente'
    };
    return roleNames[role] || role;
}

// Show user management section (for managers and admin)
function showUserManagement() {
    hideAllSections();
    document.getElementById('user-management-section').classList.remove('hidden');
    
    // Show create user section only for admin
    const createUserSection = document.getElementById('create-user-section');
    if (createUserSection) {
        if (auth.isAdmin()) {
            createUserSection.classList.remove('hidden');
        } else {
            createUserSection.classList.add('hidden');
        }
    }
    
    loadPendingUsers();
    loadAllUsers();
}

// Setup create user form (Admin only)
function setupCreateUserForm() {
    const form = document.getElementById('create-user-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userData = {
            name: document.getElementById('new-user-name').value,
            email: document.getElementById('new-user-email').value,
            password: document.getElementById('new-user-password').value,
            company: document.getElementById('new-user-company').value,
            userType: document.getElementById('new-user-type').value,
            role: document.getElementById('new-user-role').value
        };

        const success = await createNewUser(userData);
        if (success) {
            form.reset();
        }
    });
}

// Expose functions globally
window.createNewUser = createNewUser;
window.approveUser = approveUser;
window.toggleUserStatus = toggleUserStatus;
window.showEditUserModal = showEditUserModal;
window.showUserManagement = showUserManagement;
window.loadPendingUsers = loadPendingUsers;
window.loadAllUsers = loadAllUsers;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('token') && auth.isAdminOrManager()) {
        // Setup create user form for admin
        if (auth.isAdmin()) {
            setupCreateUserForm();
        }
        
        // Load users data in background
        setTimeout(() => {
            loadPendingUsers();
        }, 2000);
    }
});
