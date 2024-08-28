// esperar até a instancia subir await /iniciar-snnifer
const token = checkSessionToken();
const qrcodeContainer = document.querySelector(".qrcode-container");

var interval;

function iniciarSnnifer() {
    fetch("http://127.0.0.1:5555/iniciar-snnifer", {
        method: 'POST',
        headers: {
            "Authorization":`Bearer ${token}`
        }
    })

    interval = setInterval(() => {
        verificarQrcode();
        
    }, 10000)
}

function verificarQrcode() {
    fetch("http://127.0.0.1:5555/validar-container", {
        method: 'GET',
        headers: {
            "Authorization":`Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.data.status === "AGUARDANDO CONEXÃO") {
            // qrcode existe
            clearInterval(interval)

            interval = setInterval(() => {
                verificarConexao()    
            }, 2500)

            return qrcodeContainer.innerHTML = `<img src="${data.data.imagem}" alt="">`
        } else if (data.data.status === "ATIVA") {
            clearInterval(interval)
            
            alert("Conexão estabelecida com sucesso")
            window.location.href = "/public/dashboard.html";
        }
    })
}

function verificarConexao() {
    fetch("http://127.0.0.1:5555/validar-container", {
        method: 'GET',
        headers: {
            "Authorization":`Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.data.status === "ATIVA") {
            // identificou a conexao
            clearInterval(interval)
            
            alert("Conexão estabelecida com sucesso")
            window.location.href = "/public/dashboard.html";
        }
    })
}

iniciarSnnifer()