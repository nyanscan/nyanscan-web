const toggle = document.getElementById("ns-theme-toggle");

const theme = window.localStorage.getItem("theme");

if (theme === "dark") {
    document.body.classList.add("ns-dark");
    if (toggle) toggle.checked = true;
}

if (toggle) {
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