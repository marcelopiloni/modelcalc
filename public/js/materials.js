// Material Management Functions
let currentMaterials = [];

// Expor currentMaterials globalmente para uso em orçamentos
window.currentMaterials = currentMaterials;

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
            const result = await response.json();
            // Tratar diferentes formatos de resposta
            currentMaterials = result.data || result || [];
            // Atualizar variável global
            window.currentMaterials = currentMaterials;
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
    
    if (!tableBody) {
        console.error('Elemento materials-table-body não encontrado');
        return;
    }
    
    tableBody.innerHTML = '';
    
    if (!currentMaterials || currentMaterials.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum material encontrado</td></tr>';
        return;
    }
    
    currentMaterials.forEach(material => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${material.name || 'Nome não informado'}</td>
            <td>${material.description || 'Sem descrição'}</td>
            <td>${material.category || 'Sem categoria'}</td>
            <td>${material.unit || 'Unidade'}</td>
            <td>R$ ${(material.unitCost || 0).toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-primary edit-material-btn" data-material-id="${material._id}">Editar</button>
                <button class="btn btn-sm btn-danger delete-material-btn" data-material-id="${material._id}">Excluir</button>
            </td>
        `;
        
        // Add event listeners to buttons in this row
        const editBtn = row.querySelector('.edit-material-btn');
        const deleteBtn = row.querySelector('.delete-material-btn');
        
        editBtn.addEventListener('click', () => editMaterial(material._id));
        deleteBtn.addEventListener('click', () => deleteMaterial(material._id));
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

// Expose globally immediately
window.showNewMaterial = showNewMaterial;

// Edit material  
function editMaterial(materialId) {
    console.log('editMaterial called with ID:', materialId);
    
    const material = currentMaterials.find(m => m._id === materialId);
    if (!material) {
        console.error('Material not found:', materialId);
        alert('Material não encontrado!');
        return;
    }
    
    // Check if elements exist
    const elements = {
        title: document.getElementById('material-form-title'),
        id: document.getElementById('material-id'),
        name: document.getElementById('material-name'),
        description: document.getElementById('material-description'),
        category: document.getElementById('material-category'),
        unit: document.getElementById('material-unit'),
        unitCost: document.getElementById('material-unit-cost'),
        supplier: document.getElementById('material-supplier')
    };
    
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`Element ${key} not found in DOM`);
            alert(`Elemento ${key} não encontrado na página!`);
            return;
        }
    }
    
    elements.title.textContent = 'Editar Material';
    elements.id.value = material._id;
    elements.name.value = material.name;
    elements.description.value = material.description;
    elements.category.value = material.category;
    elements.unit.value = material.unit;
    elements.unitCost.value = material.unitCost;
    elements.supplier.value = material.supplier || '';
    
    showSection('material-form-section');
}

// Expose globally immediately
window.editMaterial = editMaterial;

// Delete material
async function deleteMaterial(materialId) {
    console.log('deleteMaterial called with ID:', materialId);
    
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

// Expose globally immediately
window.deleteMaterial = deleteMaterial;

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

// Additional global exposures
window.loadMaterials = loadMaterials;