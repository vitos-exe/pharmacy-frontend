import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super("Log in");
        if (sessionStorage.getItem("userRole") !== null){
            throw new Error("You are already authorized");
        }
    }

    createHTML() {
        var dialog = document.querySelector(".login-dialog");
        dialog.style.display = "block";
        dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.style.display = "")
    }
}