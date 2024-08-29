const exitButton = document.querySelector("a li .bx.bx-door-open");

exitButton.addEventListener("click", () => {
    document.cookie = 'sessionToken=;';
    window.location.href = "index.html";
})