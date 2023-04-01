export default class {
    constructor(title) {
        document.title = title;
    }

    static async createNavbar(){
        var navbarUrls = {
            "unauthorized": "../../layout/unauthorized_navbar.html",
            "user": "../../layout/user_navbar.html",
            "admin": "../../layout/admin_navbar.html"
        };

        return await fetch(navbarUrls[sessionStorage.getItem("userRole")] || navbarUrls.unauthorized)
            .then(r => r.text())
            .then(html => {
                document.querySelector("header").innerHTML = html;
            })
    }

    createHTML() {
        
    }
}