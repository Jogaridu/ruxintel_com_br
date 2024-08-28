// esperar até a instancia subir await /iniciar-snnifer
const token = checkSessionToken();
const qrcodeContainer = document.querySelector(".qrcode-container");

function iniciarSnnifer() {
    fetch("http://127.0.0.1:5555/iniciar-snnifer", {
        method: 'POST',
        headers: {
            "Authorization":`Bearer ${token}`
        }
    })

    setInterval(() => {
        var qrcode = verificarQrcode();
        
        qrcodeContainer.innerHTML = `<img src="${qrcode}" alt="">`
    }, 10000)
}

function verificarQrcode() {
    fetch("http://127.0.0.1:5555/validar-container", {
        method: 'POST',
        headers: {
            "Authorization":`Bearer ${token}`
        }
        .then(response => response.json())
        .then(data => {
            if (data.data.status === "AGUARDANDO CONEXÃO") {
                // qrcode existe
                return data.data.imagem
            }
        })
    })
}

await iniciarSnnifer()