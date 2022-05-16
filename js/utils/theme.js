if (window.localStorage.getItem("theme") === "dark") {
    document.body.classList.add("ns-dark");
}
function registerToggle(toggle) {
    if (toggle) {
        toggle.checked = window.localStorage.getItem("theme") === "dark";
        toggle.addEventListener("change", () => {
            if (toggle.checked) {
                if (!document.body.classList.contains("ns-dark"))
                    document.body.classList.add("ns-dark")
                window.localStorage.setItem("theme", "dark");
            } else {
                if (document.body.classList.contains("ns-dark"))
                    document.body.classList.remove("ns-dark")
                window.localStorage.setItem("theme", "light");
            }
        })
    }
}

