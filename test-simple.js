// Teste simples das rotas básicas
console.log('Testando conexão com o servidor...');

setTimeout(() => {
    console.log('Aguardando 3 segundos para o servidor inicializar...');
    
    fetch('http://localhost:3000/api')
        .then(response => response.json())
        .then(data => console.log('✅ API funcionando:', data))
        .catch(error => console.error('❌ Erro na API:', error.message));
}, 3000);