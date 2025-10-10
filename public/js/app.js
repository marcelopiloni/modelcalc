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
        budgets: document.getElementById('nav-budgets'),
        logout: document.getElementById('nav-logout')
    };

    const forms = {
        login: document.getElementById('login-form'),
        register: document.getElementById('register-form'),
        budget: document.getElementById('budget-form')
    };

    // Funções auxiliares
    function showSection(sectionId) {
        Object.values(sections).forEach(section => section.classList.add('hidden'));
        sections[sectionId].classList.remove('hidden');
    }

    function showAlert(message, type = 'error') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        document.querySelector('.container').insertBefore(alert, document.querySelector('.container').firstChild);
        
        setTimeout(() => alert.remove(), 5000);
    }

    function updateNavigation() {
        if (auth.isAuthenticated()) {
            Object.values(navLinks).forEach(link => link.classList.remove('hidden'));
            document.getElementById('user-info').textContent = auth.user.name;
            document.getElementById('user-info').classList.remove('hidden');
            showSection('budgets');
            loadBudgets();
        } else {
            Object.values(navLinks).forEach(link => link.classList.add('hidden'));
            document.getElementById('user-info').classList.add('hidden');
            showSection('login');
        }
    }

    // Gerenciamento de orçamentos
    async function loadBudgets() {
        try {
            const budgetsList = await budgets.list();
            const tbody = document.getElementById('budgets-table-body');
            tbody.innerHTML = '';

            budgetsList.forEach(budget => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${budget.clientId.name}</td>
                    <td>${budget.projectId.name}</td>
                    <td>R$ ${budget.finalPrice.toFixed(2)}</td>
                    <td>${budget.status}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="viewBudget('${budget._id}')">Ver</button>
                        ${auth.isSupplier() ? `
                            <button class="btn btn-danger btn-sm" onclick="deleteBudget('${budget._id}')">Excluir</button>
                        ` : ''}
                        <button class="btn btn-success btn-sm" onclick="downloadExcel('${budget._id}')">Excel</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            showAlert(error.message);
        }
    }

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
            await auth.register({
                name: document.getElementById('register-name').value,
                email: document.getElementById('register-email').value,
                password: document.getElementById('register-password').value,
                company: document.getElementById('register-company').value,
                userType: document.getElementById('register-type').value
            });
            updateNavigation();
        } catch (error) {
            showAlert(error.message);
        }
    });

    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('register');
    });

    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('login');
    });

    navLinks.logout.addEventListener('click', (e) => {
        e.preventDefault();
        auth.logout();
    });

    document.getElementById('new-budget-btn').addEventListener('click', () => {
        forms.budget.reset();
        document.getElementById('budget-id').value = '';
        document.getElementById('budget-form-title').textContent = 'Novo Orçamento';
        showSection('budgetForm');
    });

    document.getElementById('cancel-budget-btn').addEventListener('click', () => {
        showSection('budgets');
    });

    // Inicialização
    if (auth.initAuth()) {
        updateNavigation();
    } else {
        showSection('login');
    }
});

// Funções globais para interação com a tabela
function viewBudget(id) {
    // Implementar visualização/edição de orçamento
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
    budgets.downloadExcel(id);
}