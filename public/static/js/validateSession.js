function checkSessionToken() {
    const token = getCookie('sessionToken');

    if (!token) {
        window.location.href = '/public/401.html';
    } else {
        console.log('Token válido, acesso permitido.');
    }
}

function getCookie(name) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name + "=") === 0) {
            return cookie.substring(name.length + 1, cookie.length);
        }
    }
    return "";
}

window.onload = checkSessionToken;

// NOTAS: da para fazer bypass setando um token sessionToken com qualquer valor, a aplicação não valida a autenticidade do token no backend