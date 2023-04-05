import AbstractView from "./AbstractView.js";
import { createElementAndDoStuff } from "../Utils.js";

export default class extends AbstractView {
    constructor() {
        super("Medicine");
        var main = document.querySelector("main");

        var medicine_list = createElementAndDoStuff("section", "medicine-list")
        main.appendChild(medicine_list);

        this.addMedicineOperations(medicine_list)

        var medicine_grid = createElementAndDoStuff("div", "medicine-grid")
        medicine_list.appendChild(medicine_grid);

    }

    addMedicineOperations(medicine_list){
        var medicine_operations = createElementAndDoStuff("div", "medicine-operations");
        
        var search_bar = createElementAndDoStuff("div", "search-bar");

        var input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Search";

        var button = createElementAndDoStuff("button", null, "Go");

        search_bar.append(input, button);

        medicine_operations.appendChild(search_bar);

        medicine_list.appendChild(medicine_operations);
    }

    async renderMain(){
        var response = await fetch("http://localhost:8080/medicine/");
        var fetchedData = await response.json();
        var medicineGridEntities = fetchedData.map(e => this.getMedicineGridEntity(e));

        document.querySelector(".medicine-grid").append(...medicineGridEntities);
    }

    getMedicineGridEntity(data){
        var entity = createElementAndDoStuff("div", "medicine-entity");
        entity.id = data.id;

        var info = createElementAndDoStuff("div", "entity-info");
        info.append(
            createElementAndDoStuff("div", "main-info-field", data.name), 
            createElementAndDoStuff("div", "info-field", "$" + data.price)
        );
        entity.appendChild(info);

        var buttons = createElementAndDoStuff("div", "entity-buttons");
        var more_info_button = createElementAndDoStuff("button", "more-info-button", "More info");
        more_info_button.addEventListener("click", e => {
            if (document.querySelector(".medicine-info-dialog") === null)
                this.openMedicineMoreInfoModal(data.id)
        });

        buttons.append(
            more_info_button, 
            createElementAndDoStuff("button", "add-to-order-button", "Add to order")
        );

        entity.appendChild(buttons);

        return entity;
    }

    async openMedicineMoreInfoModal(id){
        var medicineInfo = await fetch("http://localhost:8080/medicine/" + id).then(r => r.json());
        
        var dialog = createElementAndDoStuff("div", "medicine-info-dialog");
        dialog.style.display = "block";
        dialog.append(
            createElementAndDoStuff("div", "dialog-top"),
            createElementAndDoStuff("h2", "main-info-name", medicineInfo.name),
            createElementAndDoStuff("p", "info-field", "Price: $" + medicineInfo.price),
            createElementAndDoStuff("p", "info-field", "Quantity: " + medicineInfo.quantity),
            createElementAndDoStuff("p", "info-field", "Description: " + medicineInfo.desciption)
        );

        var closeButton = createElementAndDoStuff("button", "close-button", "Close");
        dialog.append(closeButton);
        closeButton.addEventListener("click", e => document.querySelector(".medicine-list").removeChild(dialog));

        document.querySelector(".medicine-list").append(dialog);
    }
}