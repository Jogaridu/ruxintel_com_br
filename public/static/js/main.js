const cardsContainer = document.querySelector(".cards");
var contadorMensagem = 0;

// dashboard notificação
Swal.fire({
    position: "bottom-end",
    icon: "info",
    title: "Bem vindo ao Painel!",
    showConfirmButton: false,
    timer: 1750
});

// verificar novas mensagens
function verificarMensagens() {
    var classeFinal;

    fetch("https://ruxintel.r4topunk.xyz/service-crud/mensagens-criticas", {
        method: 'GET',
        headers: {
            "Authorization":`Bearer ${checkSessionToken()}`
        }    
    })
    .then(response => response.json())
    .then(data => {
        if (data.status_code != 200) {
            Swal.fire({
                position: "bottom-end",
                icon: "error",
                title: "Falha ao retornar mensagens.",
                showConfirmButton: false,
                timer: 2750
            });

            return;
        }

        if (contadorMensagem === data.data.numero_mensagens) {
            return;
        }

        contadorMensagem = data.data.numero_mensagens;

        cardsContainer.innerHTML = "";
        data.data.mensagens.forEach(mensagem => {
            // calculando score
            if (mensagem['score'] <= 7) {
                classeFinal = "safe";
            } else if (mensagem['score'] === 8) {
                classeFinal = "medium";
            } else {
                classeFinal = "danger"; 
            }

            // montando mensagem
            cardsContainer.innerHTML += `<div class="card">
        <h2>FRAUDE IDENTIFICADA</h2>
        <div class="content">
            <h3>${mensagem.notifyName} - ${mensagem.timestamp}</h3>
            <p>${mensagem.body}</p>
        </div>
        <div class="buttons">
            <button class="button-score ${classeFinal}">${mensagem['score']}0%</button>
            <button class="button-ignore">ignorar</button>
        </div>
    </div>`;

            // improviso de função de ignore
            const buttonsIgnore = document.querySelectorAll(".button-ignore");

            buttonsIgnore.forEach(button => {
                button.addEventListener('click', () => {
                    const card = button.closest('.card');
                    if (card) {
                        card.classList.add("display-none");
                    }                    
                })
            })
        })
    })

    fetch("https://ruxintel.r4topunk.xyz/service-crud/mensagens-criticas", {
        method: 'GET',
        headers: {
            "Authorization":`Bearer ${checkSessionToken()}`
        }    
    })
    .then(response => response.json())
    .then(data => {
        if (data.data.numero_mensagens === 0) {
            document.querySelector(".container").innerHTML = `<h1>Detecção em tempo real</h1>
            <div class="cards">
                
            </div>
            <div class="no-messages">
                <i class='bx bx-wink-smile'></i>
                <h2>Nenhuma fraude identificada. <br>
                    Usuário protegido!</h2>
            </div>`
        }
    })
}

setInterval(() => {
    verificarMensagens()
}, 20000)

verificarMensagens()