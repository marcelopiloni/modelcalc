// Teste simples das rotas
const fetch = require('node-fetch');

async function testAPI() {
    try {
        // Testar endpoint básico
        const response = await fetch('http://localhost:3000/api');
        const data = await response.json();
        console.log('API Response:', data);

        // Testar endpoint de registro
        const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@test.com',
                password: '123456',
                company: 'Test Company',
                userType: 'client'
            })
        });
        
        const registerData = await registerResponse.json();
        console.log('Register Response:', registerData);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

testAPI();