// esperar até a instancia subir await /iniciar-snnifer
const token = checkSessionToken();
const qrcodeContainer = document.querySelector(".qrcode-container");

var interval;

function iniciarSnnifer() {
    fetch("https://ruxintel.r4topunk.xyz/service-snnifer/iniciar-snnifer", {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Quase lá...",
        text: "Aguarde enquanto geramos o seu código de entrada!",
        showConfirmButton: false,
        timer: 3500
    });

    setTimeout(() => {
        interval = setInterval(() => {
            validarContainer();
        }, 10000);
    }, 4000);
}

function validarContainer() {
    fetch("https://ruxintel.r4topunk.xyz/service-snnifer/validar-container", {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.data.status === "AGUARDANDO CONEXÃO") {
                qrcodeContainer.innerHTML = `<img src="${data.data.imagem}" alt="">`
            } else if (data.data.status === "ATIVA") {
                encaminharDashboard(interval)
            }
        })
}

function encaminharDashboard(interval) {
    clearInterval(interval)

    Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: "Dispositivo conectado!",
        showConfirmButton: false,
        timer: 2000
    });

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 2500);
}

// iniciarSnnifer()