// Test functions to verify onclick handlers are working
function testMaterialEdit() {
    console.log('Test material edit called');
    alert('Teste de edição de material funcionando!');
}

function testMaterialDelete() {
    console.log('Test material delete called');
    alert('Teste de exclusão de material funcionando!');
}

// Expose test functions immediately
window.testMaterialEdit = testMaterialEdit;
window.testMaterialDelete = testMaterialDelete;

console.log('Test functions loaded');