const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("show");
    });
}

document.addEventListener("click", (event) => {
    if (
        window.innerWidth <= 900 &&
        sidebar &&
        menuBtn &&
        !sidebar.contains(event.target) &&
        !menuBtn.contains(event.target)
    ) {
        sidebar.classList.remove("show");
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && sidebar) {
        sidebar.classList.remove("show");
    }
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("sw.js")
            .catch((error) => console.error("Service Worker:", error));
    });
}
