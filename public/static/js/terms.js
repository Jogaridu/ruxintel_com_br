const checkbox = document.getElementById("checkbox");
const button = document.querySelector(".button-default.inactive");

checkbox.addEventListener("click", () => {
    button.classList.toggle("inactive");
})

button.addEventListener("click", () => {
    window.location.href = "/public/connect.html";
    checkbox.checked = false;
})