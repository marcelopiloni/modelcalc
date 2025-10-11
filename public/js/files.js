// CAD Files Management Functions
let currentCADFiles = [];

// Load CAD files
async function loadCADFiles() {
    try {
        const response = await fetch('/api/files', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            currentCADFiles = await response.json();
            displayCADFiles();
        } else {
            alert('Erro ao carregar arquivos CAD');
        }
    } catch (error) {
        console.error('Erro ao carregar arquivos CAD:', error);
        alert('Erro ao carregar arquivos CAD');
    }
}

// Display CAD files in table
function displayCADFiles() {
    const tableBody = document.getElementById('files-table-body');
    tableBody.innerHTML = '';
    
    if (!currentCADFiles.data || currentCADFiles.data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum arquivo encontrado</td></tr>';
        return;
    }
    
    currentCADFiles.data.forEach(file => {
        const row = document.createElement('tr');
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        const projectName = file.projectId ? file.projectId.name : '-';
        const budgetDesc = file.budgetId ? file.budgetId.description : '-';
        const linkedTo = projectName !== '-' ? `Projeto: ${projectName}` : 
                        budgetDesc !== '-' ? `Orçamento: ${budgetDesc}` : 'Não vinculado';
        
        row.innerHTML = `
            <td>${file.originalName}</td>
            <td>${file.format.toUpperCase()}</td>
            <td>${fileSize} MB</td>
            <td>${linkedTo}</td>
            <td>
                <span class="file-status file-status-${file.processed ? 'completed' : 'processing'}">
                    ${file.processed ? 'Processado' : 'Processando'}
                </span>
            </td>
            <td>
                <button onclick="viewCADFile('${file._id}')" class="btn btn-sm btn-primary">Ver</button>
                <button onclick="downloadCADFile('${file._id}')" class="btn btn-sm btn-success">Download</button>
                <button onclick="deleteCADFile('${file._id}')" class="btn btn-sm btn-danger">Excluir</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Show upload form
function showUploadCADForm() {
    loadProjectsForCAD();
    loadBudgetsForCAD();
    showSection('cad-upload-section');
}

// Load projects for CAD upload form
async function loadProjectsForCAD() {
    try {
        const response = await fetch('/api/projects', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const projects = await response.json();
            const select = document.getElementById('cad-project');
            select.innerHTML = '<option value="">Selecione um projeto</option>';
            
            if (projects.data) {
                projects.data.forEach(project => {
                    if (project.status === 'active') {
                        const option = document.createElement('option');
                        option.value = project._id;
                        option.textContent = project.name;
                        select.appendChild(option);
                    }
                });
            }
        }
    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
    }
}

// Load budgets for CAD upload form
async function loadBudgetsForCAD() {
    try {
        const response = await fetch('/api/budgets', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const budgets = await response.json();
            const select = document.getElementById('cad-budget');
            select.innerHTML = '<option value="">Selecione um orçamento</option>';
            
            if (budgets.data) {
                budgets.data.forEach(budget => {
                    const option = document.createElement('option');
                    option.value = budget._id;
                    option.textContent = `${budget.description} - ${budget.projectId ? budget.projectId.name : 'Sem projeto'}`;
                    select.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Erro ao carregar orçamentos:', error);
    }
}

// Handle CAD file upload
document.getElementById('cad-upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('cad-file');
    const projectSelect = document.getElementById('cad-project');
    const budgetSelect = document.getElementById('cad-budget');
    
    if (!fileInput.files[0]) {
        alert('Por favor, selecione um arquivo');
        return;
    }
    
    const formData = new FormData();
    formData.append('cadFile', fileInput.files[0]);
    
    if (projectSelect.value) {
        formData.append('projectId', projectSelect.value);
    }
    
    if (budgetSelect.value) {
        formData.append('budgetId', budgetSelect.value);
    }
    
    // Show progress bar
    const progressDiv = document.getElementById('upload-progress');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    progressDiv.classList.remove('hidden');
    
    try {
        const xhr = new XMLHttpRequest();
        
        // Update progress
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                progressFill.style.width = percentComplete + '%';
                progressText.textContent = Math.round(percentComplete) + '%';
            }
        });
        
        // Handle completion
        xhr.onload = function() {
            if (xhr.status === 201) {
                alert('Arquivo enviado com sucesso!');
                showSection('files-section');
                loadCADFiles();
                document.getElementById('cad-upload-form').reset();
            } else {
                const response = JSON.parse(xhr.responseText);
                alert('Erro ao enviar arquivo: ' + response.message);
            }
            progressDiv.classList.add('hidden');
            progressFill.style.width = '0%';
            progressText.textContent = '0%';
        };
        
        // Handle error
        xhr.onerror = function() {
            alert('Erro na comunicação com o servidor');
            progressDiv.classList.add('hidden');
            progressFill.style.width = '0%';
            progressText.textContent = '0%';
        };
        
        xhr.open('POST', '/api/files/upload');
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
        xhr.send(formData);
        
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        alert('Erro ao fazer upload do arquivo');
        progressDiv.classList.add('hidden');
    }
});

// View CAD file details
function viewCADFile(fileId) {
    // Implementation for viewing CAD file details
    alert('Funcionalidade de visualização será implementada em breve');
}

// Download CAD file
function downloadCADFile(fileId) {
    const token = localStorage.getItem('token');
    window.open(`/api/files/${fileId}/download?token=${token}`, '_blank');
}

// Delete CAD file
async function deleteCADFile(fileId) {
    if (!confirm('Tem certeza que deseja excluir este arquivo?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/files/${fileId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            alert('Arquivo excluído com sucesso!');
            loadCADFiles();
        } else {
            alert('Erro ao excluir arquivo');
        }
    } catch (error) {
        console.error('Erro ao excluir arquivo:', error);
        alert('Erro ao excluir arquivo');
    }
}

// Cancel upload form
document.getElementById('cancel-upload-btn').addEventListener('click', () => {
    showSection('files-section');
});

// Upload CAD button
document.getElementById('upload-cad-btn').addEventListener('click', () => {
    showUploadCADForm();
});

// Initialize CAD files when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('token')) {
        loadCADFiles();
    }
});