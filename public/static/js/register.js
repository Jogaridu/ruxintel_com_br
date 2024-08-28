// pega as informações do formulario de registro
const form = document.querySelector(".login-form form").addEventListener("submit", (event) => {
    event.preventDefault();
    
    const username = document.getElementById("username").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    // consulta no crud service
    fetch("http://127.0.0.1:3333/usuario", {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({ password: password, username: username, phone: phone })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status_code === 200) {
            Swal.fire({
                title: "Success!",
                text: data.message,
                icon: "success"
            });
        } else {
            Swal.fire({
                title: "Register failed",
                text: data.message,
                icon: "error"
            });
        }
    })
})