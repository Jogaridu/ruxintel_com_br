function checkSessionToken() {
    const token = getCookie('sessionToken');

    if (!token || token.trim() === "") {
        window.location.href = 'index.html';
    } else {
        return token
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