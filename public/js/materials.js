// Material Management Functions
let currentMaterials = [];

// Load materials
async function loadMaterials() {
    try {
        const response = await fetch('/api/materials', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            currentMaterials = await response.json();
            displayMaterials();
            updateMaterialSelectors();
        } else {
            alert('Erro ao carregar materiais');
        }
    } catch (error) {
        console.error('Erro ao carregar materiais:', error);
        alert('Erro ao carregar materiais');
    }
}

// Display materials in table
function displayMaterials() {
    const tableBody = document.getElementById('materials-table-body');
    tableBody.innerHTML = '';
    
    if (currentMaterials.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum material encontrado</td></tr>';
        return;
    }
    
    currentMaterials.forEach(material => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${material.name}</td>
            <td>${material.description}</td>
            <td>${material.category}</td>
            <td>${material.unit}</td>
            <td>R$ ${material.unitCost.toFixed(2)}</td>
            <td>
                <button onclick="editMaterial('${material._id}')" class="btn btn-sm btn-primary">Editar</button>
                <button onclick="deleteMaterial('${material._id}')" class="btn btn-sm btn-danger">Excluir</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update material selectors in budget form
function updateMaterialSelectors() {
    // This will be called when adding materials to budget
    // The actual implementation will be in the addMaterialRow function
}

// Show new material form
function showNewMaterial() {
    document.getElementById('material-form-title').textContent = 'Novo Material';
    document.getElementById('material-form').reset();
    document.getElementById('material-id').value = '';
    showSection('material-form-section');
}

// Edit material
function editMaterial(materialId) {
    const material = currentMaterials.find(m => m._id === materialId);
    if (!material) return;
    
    document.getElementById('material-form-title').textContent = 'Editar Material';
    document.getElementById('material-id').value = material._id;
    document.getElementById('material-name').value = material.name;
    document.getElementById('material-description').value = material.description;
    document.getElementById('material-category').value = material.category;
    document.getElementById('material-unit').value = material.unit;
    document.getElementById('material-unit-cost').value = material.unitCost;
    document.getElementById('material-supplier').value = material.supplier || '';
    
    showSection('material-form-section');
}

// Delete material
async function deleteMaterial(materialId) {
    if (!confirm('Tem certeza que deseja excluir este material?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/materials/${materialId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            alert('Material excluído com sucesso!');
            loadMaterials();
        } else {
            alert('Erro ao excluir material');
        }
    } catch (error) {
        console.error('Erro ao excluir material:', error);
        alert('Erro ao excluir material');
    }
}

// Handle material form submit
document.getElementById('material-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const materialId = document.getElementById('material-id').value;
    const materialData = {
        name: document.getElementById('material-name').value,
        description: document.getElementById('material-description').value,
        category: document.getElementById('material-category').value,
        unit: document.getElementById('material-unit').value,
        unitCost: parseFloat(document.getElementById('material-unit-cost').value),
        supplier: document.getElementById('material-supplier').value
    };
    
    try {
        const url = materialId ? `/api/materials/${materialId}` : '/api/materials';
        const method = materialId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(materialData)
        });
        
        if (response.ok) {
            alert(materialId ? 'Material atualizado com sucesso!' : 'Material criado com sucesso!');
            showSection('materials-section');
            loadMaterials();
        } else {
            alert('Erro ao salvar material');
        }
    } catch (error) {
        console.error('Erro ao salvar material:', error);
        alert('Erro ao salvar material');
    }
});

// Cancel material form
document.getElementById('cancel-material-btn').addEventListener('click', () => {
    showSection('materials-section');
});

// Initialize materials when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('token')) {
        loadMaterials();
    }
});