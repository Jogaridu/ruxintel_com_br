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
        if (!data.erro) {
            document.cookie = `sessionToken=${data.token}`

            // validar se o usuário já passou pelo onboarding
            fetch("http://127.0.0.1:5555/validar-container", {
                method: 'GET',
                headers: {
                    "Authorization":`Bearer ${data.token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.data.status === "ATIVA") {
                    window.location.href = '/public/dashboard.html';
                } else {
                    window.location.href = '/public/onboarding.html';
                }
            })
        } else {
            // caso o usuário/senha esteja incorreto => retornar erro
            alert('Login failed: ' + data.erro);
        }
    })
})