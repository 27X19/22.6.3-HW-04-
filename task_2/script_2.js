document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector(".sample__button");
    const icons = button.querySelectorAll(".sample__icon");

    button.addEventListener("click", () => {
        icons.forEach(icon => icon.classList.toggle("sample__icon--hide"));
    });
});
