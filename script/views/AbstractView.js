export default class {
    constructor(title) {
        document.title = title;
        document.body.append(document.createElement("header"))
        document.body.append(document.createElement("main"))
    }

    async render(){
        await this.createNavbar();
        await this.renderMain();
    }

    async createNavbar(){
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

    async createMain() {
        
    }
}