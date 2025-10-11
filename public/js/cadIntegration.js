// CAD Integration with Budgets
let selectedCADFiles = [];
let availableCADFiles = [];

// Initialize CAD integration when budget form is opened
async function initializeCADIntegration() {
    try {
        // Load available CAD files
        await loadAvailableCADFiles();
        
        // Setup event listeners
        setupCADEventListeners();
    } catch (error) {
        console.error('Error initializing CAD integration:', error);
    }
}

// Load available CAD files
async function loadAvailableCADFiles() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/files', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const result = await response.json();
            availableCADFiles = result.data || [];
        } else {
            console.error('Failed to load CAD files');
            availableCADFiles = [];
        }
    } catch (error) {
        console.error('Error loading CAD files:', error);
        availableCADFiles = [];
    }
}

// Setup event listeners for CAD integration
function setupCADEventListeners() {
    // Select CAD files button
    document.getElementById('select-cad-files-btn').addEventListener('click', showCADFilesModal);
    
    // Auto-fill from CAD button
    document.getElementById('auto-fill-from-cad-btn').addEventListener('click', autoFillFromCAD);
    
    // Modal close buttons
    document.getElementById('close-cad-modal').addEventListener('click', hideCADFilesModal);
    document.getElementById('cancel-cad-selection').addEventListener('click', hideCADFilesModal);
    document.getElementById('confirm-cad-selection').addEventListener('click', confirmCADSelection);
    
    // Close modal when clicking outside
    document.getElementById('cad-files-modal').addEventListener('click', (e) => {
        if (e.target.id === 'cad-files-modal') {
            hideCADFilesModal();
        }
    });
}

// Show CAD files selection modal
async function showCADFilesModal() {
    await loadAvailableCADFiles();
    renderAvailableCADFiles();
    document.getElementById('cad-files-modal').classList.remove('hidden');
}

// Hide CAD files selection modal
function hideCADFilesModal() {
    document.getElementById('cad-files-modal').classList.add('hidden');
}

// Render available CAD files in modal
function renderAvailableCADFiles() {
    const container = document.getElementById('available-cad-files');
    
    if (!availableCADFiles || availableCADFiles.length === 0) {
        container.innerHTML = '<p class="text-muted">Nenhum arquivo CAD encontrado. <a href="#" class="upload-cad-link">Fazer upload</a></p>';
        
        // Add event listener to the upload link
        const uploadLink = container.querySelector('.upload-cad-link');
        if (uploadLink) {
            uploadLink.addEventListener('click', (e) => {
                e.preventDefault();
                showUploadCADForm();
                hideCADFilesModal();
            });
        }
        return;
    }

    container.innerHTML = '';
    
    availableCADFiles.forEach(file => {
        const fileElement = createCADFileElement(file);
        container.appendChild(fileElement);
    });
}

// Create CAD file element for modal
function createCADFileElement(file) {
    const element = document.createElement('div');
    element.className = 'cad-file-item';
    element.dataset.fileId = file._id;
    
    // Check if file is already selected
    if (selectedCADFiles.some(f => f._id === file._id)) {
        element.classList.add('selected');
    }
    
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    const processedStatus = file.processed ? '✅ Processado' : '⏳ Processando';
    
    element.innerHTML = `
        <div class="cad-file-header">
            <span class="cad-file-icon">📄</span>
            <span class="cad-file-name">${file.originalName}</span>
            <span class="cad-file-format">${file.format}</span>
        </div>
        <div class="cad-file-details">
            <div>Tamanho: ${fileSize} MB</div>
            <div>Status: ${processedStatus}</div>
        </div>
        ${file.processed && file.analysis ? `
            <div class="cad-file-analysis">
                <div class="analysis-item">
                    <span>Volume:</span>
                    <span>${file.analysis.volume || 0} cm³</span>
                </div>
                <div class="analysis-item">
                    <span>Complexidade:</span>
                    <span>${file.analysis.complexity || 'N/A'}</span>
                </div>
                <div class="analysis-item">
                    <span>Tempo estimado:</span>
                    <span>${file.analysis.estimatedMachiningTime || 0}h</span>
                </div>
            </div>
        ` : ''}
    `;
    
    // Add click event to select/deselect file
    element.addEventListener('click', () => toggleCADFileSelection(file, element));
    
    return element;
}

// Toggle CAD file selection
function toggleCADFileSelection(file, element) {
    const isSelected = selectedCADFiles.some(f => f._id === file._id);
    
    if (isSelected) {
        // Remove from selection
        selectedCADFiles = selectedCADFiles.filter(f => f._id !== file._id);
        element.classList.remove('selected');
    } else {
        // Add to selection
        selectedCADFiles.push(file);
        element.classList.add('selected');
    }
}

// Confirm CAD file selection
function confirmCADSelection() {
    updateSelectedCADFilesDisplay();
    updateAutoFillButton();
    hideCADFilesModal();
}

// Update display of selected CAD files in budget form
function updateSelectedCADFilesDisplay() {
    const container = document.getElementById('cad-files-list');
    
    if (selectedCADFiles.length === 0) {
        container.innerHTML = '<p class="text-muted">Nenhum arquivo selecionado</p>';
        return;
    }
    
    container.innerHTML = '<div class="selected-cad-files"></div>';
    const filesContainer = container.querySelector('.selected-cad-files');
    
    selectedCADFiles.forEach(file => {
        const fileElement = document.createElement('div');
        fileElement.className = 'selected-cad-file';
        
        const analysisInfo = file.processed && file.analysis ? 
            `${file.analysis.volume || 0} cm³, ${file.analysis.complexity || 'N/A'}, ${file.analysis.estimatedMachiningTime || 0}h` :
            'Processando...';
            
        fileElement.innerHTML = `
            <div class="selected-cad-file-info">
                <div class="selected-cad-file-name">📄 ${file.originalName}</div>
                <div class="selected-cad-file-details">${analysisInfo}</div>
            </div>
            <button type="button" class="remove-cad-file" data-file-id="${file._id}" title="Remover arquivo">×</button>
        `;
        
        // Add event listener to remove button
        const removeBtn = fileElement.querySelector('.remove-cad-file');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => removeCADFile(file._id));
        }
        
        filesContainer.appendChild(fileElement);
    });
}

// Remove CAD file from selection
function removeCADFile(fileId) {
    selectedCADFiles = selectedCADFiles.filter(f => f._id !== fileId);
    updateSelectedCADFilesDisplay();
    updateAutoFillButton();
}

// Update auto-fill button state
function updateAutoFillButton() {
    const autoFillBtn = document.getElementById('auto-fill-from-cad-btn');
    const hasProcessedFiles = selectedCADFiles.some(f => f.processed && f.analysis);
    
    autoFillBtn.disabled = !hasProcessedFiles;
    autoFillBtn.textContent = hasProcessedFiles ? 
        '🤖 Auto-completar com dados do CAD' : 
        '⏳ Aguardando processamento do CAD';
}

// Auto-fill budget data from CAD analysis
function autoFillFromCAD() {
    if (selectedCADFiles.length === 0) {
        showAlert('Nenhum arquivo CAD selecionado');
        return;
    }
    
    const processedFiles = selectedCADFiles.filter(f => f.processed && f.analysis);
    if (processedFiles.length === 0) {
        showAlert('Aguarde o processamento dos arquivos CAD');
        return;
    }
    
    // Calculate totals from all processed files
    let totalVolume = 0;
    let totalMachiningTime = 0;
    let allSuggestedMaterials = [];
    let allSuggestedProcesses = [];
    let maxComplexity = 'low';
    
    processedFiles.forEach(file => {
        const analysis = file.analysis;
        totalVolume += analysis.volume || 0;
        totalMachiningTime += analysis.estimatedMachiningTime || 0;
        
        if (analysis.suggestedMaterials) {
            allSuggestedMaterials = [...allSuggestedMaterials, ...analysis.suggestedMaterials];
        }
        
        if (analysis.manufacturingProcesses) {
            allSuggestedProcesses = [...allSuggestedProcesses, ...analysis.manufacturingProcesses];
        }
        
        // Determine highest complexity
        if (analysis.complexity === 'high' || (analysis.complexity === 'medium' && maxComplexity === 'low')) {
            maxComplexity = analysis.complexity;
        }
    });
    
    // Remove duplicates
    allSuggestedMaterials = [...new Set(allSuggestedMaterials)];
    allSuggestedProcesses = [...new Set(allSuggestedProcesses)];
    
    // Auto-fill materials if materials list is empty
    const materialsContainer = document.getElementById('materials-list');
    if (materialsContainer.children.length === 0) {
        allSuggestedMaterials.slice(0, 3).forEach(materialName => {
            // Try to find matching material in currentMaterials
            const matchingMaterial = window.currentMaterials?.find(m => 
                m.name.toLowerCase().includes(materialName.toLowerCase()) ||
                materialName.toLowerCase().includes(m.name.toLowerCase())
            );
            
            if (matchingMaterial) {
                const quantity = Math.ceil(totalVolume / 100); // Rough estimation
                addMaterialRow({
                    materialId: matchingMaterial._id,
                    name: matchingMaterial.name,
                    quantity: quantity,
                    unitCost: matchingMaterial.unitCost
                });
            }
        });
    }
    
    // Auto-fill processes if processes list is empty
    const processesContainer = document.getElementById('processes-list');
    if (processesContainer.children.length === 0) {
        allSuggestedProcesses.slice(0, 2).forEach(processName => {
            const duration = totalMachiningTime / allSuggestedProcesses.length;
            const hourlyRate = maxComplexity === 'high' ? 150 : maxComplexity === 'medium' ? 100 : 75;
            
            addProcessRow({
                name: processName,
                duration: Math.round(duration * 10) / 10,
                hourlyRate: hourlyRate
            });
        });
    }
    
    // Update labor cost based on complexity
    const laborCostInput = document.getElementById('budget-labor-cost');
    if (!laborCostInput.value || laborCostInput.value == 0) {
        const complexityMultiplier = maxComplexity === 'high' ? 1.5 : maxComplexity === 'medium' ? 1.2 : 1.0;
        const estimatedLaborCost = totalMachiningTime * 80 * complexityMultiplier; // Base rate of R$80/hour
        laborCostInput.value = Math.round(estimatedLaborCost);
    }
    
    showAlert(`Dados preenchidos automaticamente baseado em ${processedFiles.length} arquivo(s) CAD processado(s)`, 'success');
}

// Clear CAD selection (when creating new budget)
function clearCADSelection() {
    selectedCADFiles = [];
    updateSelectedCADFilesDisplay();
    updateAutoFillButton();
}

// Expose functions globally
window.removeCADFile = removeCADFile;
window.initializeCADIntegration = initializeCADIntegration;
window.clearCADSelection = clearCADSelection;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('token')) {
        setTimeout(() => {
            initializeCADIntegration();
        }, 1500); // Wait for other modules to load
    }
});