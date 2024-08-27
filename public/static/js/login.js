// caso identifique um evento de submit
var form = document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();

    // recebe as informações do formulário
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    // consulta no crud service
    fetch("http://127.0.0.1:3333/login", {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.erro === "Usuário ou senha incorreto.") {
            // caso o usuário exista => setar o token de sessão
            alert('Login successful!');

            document.cookie = `sessionToken=${data.token}`
            window.location.href = '/public/dashboard.html';
        } else {
            // caso o usuário/senha esteja incorreto => retornar erro
            alert('Login failed: ' + data.erro);
        }
    })
})