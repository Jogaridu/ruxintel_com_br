// utilizar alguma logica para entender se o usuário já passou pelo processo de onboarding, caso não encaminhar ele para o onboarding (ja que as informações que a gente vai consumir só vão estar disponíveis caso o usuário ja tenha configurado o whats)

const cards = document.querySelector(".cards");
const cardElements = cards.querySelectorAll(".card");

if (cardElements.lenght == 0) {
    // logica caso nao tenha nenhuma notificação
    alert("sem mensagens");
} 

// logica default do dashboard para puxar as informações das mensagens
    // de 10 em 10 segundos chama a função que vai bater no endpoint /pegar-mensagens
    // fazer um foreach e para cada mensagem montar no front para exibir

    // fetch("/pegar-mensagens", {
    //     method: 'GET'
    // })
    // .then(response => {
    //     print(response.json())
        
    //     return response.json()
    // })
        
    // setInterval(() => {
    //     fetch("/pegar-mensagens", {
    //         method: 'GET'
    //     })
    //     .then(response => {
    //         print(response.json())
            
    //         return response.json()
    //     })
    // }, 10000)