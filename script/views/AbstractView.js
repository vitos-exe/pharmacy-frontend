export default class {
    constructor() {
        var navbarUrls = {
            "unauthorized": "../../layout/unauthorized_navbar.html",
            "user": "../../layout/user_navbar.html",
            "admin": "../../layout/admin_navbar.html"
        }

        fetch(navbarUrls[sessionStorage.getItem("userRole")] || navbarUrls.unauthorized)
            .then(r => r.text())
            .then(html => {
                document.querySelector("header").innerHTML = html
            })
    }

    setTitle(title) {
        document.title = title;
    }

    async getHtml() {
        return "";
    }
}