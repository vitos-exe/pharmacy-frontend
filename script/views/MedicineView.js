import AbstractView from './AbstractView.js';
import { createElementAndDoStuff, getFormGroup } from '../Utils.js';

export default class extends AbstractView {
    constructor() {
        super('Medicine');
        const main = document.querySelector('main');

        const medicineList = createElementAndDoStuff('section', 'medicine-list');
        main.appendChild(medicineList);

        this.addMedicineOperations(medicineList);

        const medicineGrid = createElementAndDoStuff('div', 'medicine-grid');
        medicineList.appendChild(medicineGrid);
    }

    addMedicineOperations(medicineList) {
        const medicineOperations = createElementAndDoStuff('div', 'medicine-operations');

        const searchBar = createElementAndDoStuff('div', 'search-bar');

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Search';

        const button = createElementAndDoStuff('button', null, 'Go');

        searchBar.append(input, button);

        if (sessionStorage.userRole === 'admin'){
            this.addMedicineAdminButtons(medicineOperations);
        }

        medicineOperations.appendChild(searchBar);

        medicineList.appendChild(medicineOperations);
    }

    addMedicineAdminButtons(operationsDiv){
        const addMedicineButton = createElementAndDoStuff("button", "add-medicine-botton", "Add medicine");
        addMedicineButton.addEventListener("click", () => {
            if (document.querySelector(".medicine-create-dialog")  === null){
                this.openAddMedicineDialog();
            }
        });

        const showDemandButton = createElementAndDoStuff("button", "demand-list-botton", "Demand list");
        showDemandButton.addEventListener("click", () => {
            if (document.querySelector(".demand-list-dialog")  === null){
                this.showDemandDialog();
            }
        });

        const medicineAdminButtons = createElementAndDoStuff("div", "medicine-buttons");
        medicineAdminButtons.append(addMedicineButton, showDemandButton);

        operationsDiv.append(medicineAdminButtons);
    }

    openAddMedicineDialog(){
        const medicineCreateDialog = createElementAndDoStuff('div', 'medicine-create-dialog');

        const medicineCreateHeader = createElementAndDoStuff('div', 'medicine-create-dialog-header');
        const closeButton = createElementAndDoStuff('button', 'dialog-close', 'x');
        closeButton.addEventListener('click', 
            () => document.querySelector('.medicine-buttons').removeChild(medicineCreateDialog)
        );
        medicineCreateHeader.append(
            createElementAndDoStuff('h2', null, 'Add new medicine'),
            closeButton,
        );

        const medicineCreateForm = createElementAndDoStuff('form', 'medicine-create-dialog-form');

        const submitButton = createElementAndDoStuff('button', 'submit-btn', 'Submit');
        submitButton.type = 'submit';

        medicineCreateForm.append(
            ...['name', 'price', 'quantity', 'description'].map((field) => getFormGroup(field)),
            submitButton,
        );

        medicineCreateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createMedicine(medicineCreateForm);
        });

        medicineCreateDialog.append(medicineCreateHeader, medicineCreateForm);

        document.querySelector('.add-medicine-botton').insertAdjacentElement('afterend', medicineCreateDialog);
    }

    async createMedicine(form){
        const formValues = {};

        const formGroups = form.getElementsByClassName('form-group');
        for (let i = 0; i < formGroups.length; i += 1) {
            const formGroup = formGroups[i];

            const label = formGroup.querySelector('label');
            const input = formGroup.querySelector('input');

            if (label && input) {
                const key = label.getAttribute('for').slice(5);
                const { value } = input;
                formValues[key] = value;
            }
        }

        const response = await fetch('http://localhost:8080/medicine/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(`${sessionStorage.userEmail}:${sessionStorage.userPassword}`)}`
            },
            body: JSON.stringify(formValues),
        });

        if (response.status !== 201) {
            alert(await response.text());
        } else {
            alert('Medicine was created');
            document.querySelector('.medicine-buttons').removeChild(document.querySelector('.medicine-create-dialog'));
            document.querySelector(".medicine-grid").append(this.getMedicineGridEntity(await response.json()));
        }
    }

    async showDemandDialog(){
        const demandListDialog = createElementAndDoStuff("div", "demand-list-dialog");
        const closeButton = createElementAndDoStuff("button", "close-button", "Close");
        closeButton.addEventListener("click", () => document.querySelector(".medicine-buttons").removeChild(demandListDialog));

        const table = createElementAndDoStuff("table");
        const tableBody = createElementAndDoStuff("tbody",  "demand-list-body");
        table.appendChild(tableBody);

        const data = await fetch("http://localhost:8080/medicine/demand", {
            headers: {
                Authorization: `Basic ${btoa(`${sessionStorage.userEmail}:${sessionStorage.userPassword}`)}`
            }
        }).then(r => r.json());

        data.forEach(element => {
            const tableRow = createElementAndDoStuff("tr");
            tableRow.append(
                createElementAndDoStuff("td", null, element.name),
                createElementAndDoStuff("td", null, element.quantity)
            );
            tableBody.appendChild(tableRow);
        });

        demandListDialog.append(createElementAndDoStuff("div", "dialog-top"), table, closeButton);
        document.querySelector(".demand-list-botton").insertAdjacentElement("afterend", demandListDialog);
    }

    async render() {
        const response = await fetch('http://localhost:8080/medicine/');
        const fetchedData = await response.json();
        const medicineGridEntities = fetchedData.map((e) => this.getMedicineGridEntity(e));

        document.querySelector('.medicine-grid').append(...medicineGridEntities);
    }

    getMedicineGridEntity(data) {
        const entity = createElementAndDoStuff('div', 'medicine-entity');
        entity.id = data.id;

        const info = createElementAndDoStuff('div', 'entity-info');
        info.append(
            createElementAndDoStuff('div', 'main-info-field', data.name),
            createElementAndDoStuff('div', 'info-field', `$${data.price}`),
        );
        entity.appendChild(info);

        const buttons = createElementAndDoStuff('div', 'entity-buttons');

        const moreInfoButton = createElementAndDoStuff('button', 'more-info-button', 'More info');
        moreInfoButton.addEventListener('click', () => {
            if (document.querySelector('.medicine-info-dialog') === null) this.openMedicineMoreInfoModal(data.id);
        });
        buttons.append(moreInfoButton);

        const role = sessionStorage.getItem('userRole');
        if (role === 'user') {
            const addToOrderButton = createElementAndDoStuff('button', 'add-to-order-button', 'Add to order');
            addToOrderButton.addEventListener('click', () => this.addToCart(data));
            buttons.append(addToOrderButton);
        } else if (role === 'admin') {
            const editButton = createElementAndDoStuff('button', 'edit-button', 'Edit');
            editButton.addEventListener('click', () => this.openMedicineEditModal(data.id));
            buttons.append(editButton);
        }

        entity.appendChild(buttons);

        return entity;
    }

    openMedicineEditModal(id){
        const editMedicineDialog = createElementAndDoStuff('div', 'medicine-edit-dialog');

        const editHeader = createElementAndDoStuff('div', 'medicine-edit-dialog-header');
        const closeButton = createElementAndDoStuff('button', 'dialog-close', 'x');
        closeButton.addEventListener('click', () => document.querySelector('.medicine-list').removeChild(editMedicineDialog));
        editHeader.append(
            createElementAndDoStuff('h2', null, 'Edit medicine'),
            closeButton,
        );

        const editForm = createElementAndDoStuff('form', 'medicine-edit-dialog-form');

        const deleteButton = createElementAndDoStuff('button', 'btn-delete', 'Delete');
        deleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.deleteMedicine(id);
        });

        const submitButton = createElementAndDoStuff('button', 'submit-btn', 'Submit');
        submitButton.type = 'submit';

        editForm.append(
            ...['name', 'price', 'quantity', 'description'].map((field) => this.getFormGroup(field, false)),
            deleteButton,
            submitButton,
        );

        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.editMedicine(id, editForm);
        });

        editMedicineDialog.append(editHeader, editForm);

        document.querySelector('.medicine-grid').insertAdjacentElement('afterend', editMedicineDialog);
    }

    async deleteMedicine(id){
        const encodedAuth = btoa(`${sessionStorage.userEmail}:${sessionStorage.userPassword}`);

        const response = await fetch(`http://localhost:8080/medicine/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Basic ${encodedAuth}`,
            },
        });

        if (response.status !== 200) {
            alert(await response.text());
        } else {
            alert('Medicine was deleted');
            document.querySelector(".medicine-grid").removeChild(document.getElementById(id));
            document.querySelector(".dialog-close").click();
        }
    }

    async editMedicine(id, form){
        const formValues = {};

        const formGroups = form.getElementsByClassName('form-group');

        for (let i = 0; i < formGroups.length; i += 1) {
            const formGroup = formGroups[i];

            const label = formGroup.querySelector('label');
            const input = formGroup.querySelector('input');

            if (label && input && input.value !== '') {
                const key = label.getAttribute('for').slice(5);
                const { value } = input;
                formValues[key] = value;
            }
        }

        if (Object.keys(formValues).length === 0) {
            alert("You didn't input anything!");
            return;
        }

        const encodedAuth = btoa(`${sessionStorage.userEmail}:${sessionStorage.userPassword}`);

        const response = await fetch(`http://localhost:8080/medicine/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${encodedAuth}`,
            },
            body: JSON.stringify(formValues),
        });

        if (response.status !== 200) {
            alert(await response.text());
        } else {
            alert('Medicine was changed');
            document.querySelector(".dialog-close").click();
            console.log(document.getElementById(id));
            document.querySelector(".medicine-grid").replaceChild(
                await fetch(`http://localhost:8080/medicine/${id}`)
                    .then(r => r.json())
                    .then(json => this.getMedicineGridEntity(json)), 
                document.getElementById(id)
            )
        }
    }

    async openMedicineMoreInfoModal(id) {
        const medicineInfo = await fetch(`http://localhost:8080/medicine/${id}`).then((r) => r.json());

        const dialog = createElementAndDoStuff('div', 'medicine-info-dialog');
        dialog.style.display = 'block';
        dialog.append(
            createElementAndDoStuff('div', 'dialog-top'),
            createElementAndDoStuff('h2', 'main-info-name', medicineInfo.name),
            createElementAndDoStuff('p', 'info-field', `Price: $${medicineInfo.price}`),
            createElementAndDoStuff('p', 'info-field', `Quantity: ${medicineInfo.quantity}`),
            createElementAndDoStuff('p', 'info-field', `Description: ${medicineInfo.description}`),
        );

        const closeButton = createElementAndDoStuff('button', 'close-button', 'Close');
        dialog.append(closeButton);
        closeButton.addEventListener('click', (e) => document.querySelector('.medicine-list').removeChild(dialog));

        document.querySelector('.medicine-list').append(dialog);
    }

    addToCart(data) {
        if (document.getElementById(data.id) !== null) {
            return;
        }

        const newEntry = createElementAndDoStuff('div', 'medicine-row');

        const label = createElementAndDoStuff('label', null, data.name[0].toUpperCase() + data.name.slice(1));
        label.for = data.name;
        const input = createElementAndDoStuff('input');
        input.type = 'number';
        input.id = data.id;
        input.name = data.name;
        input.min = 0;
        input.value = 1;

        newEntry.append(label, input);

        document.querySelector('.form-submit-btn').insertAdjacentElement('beforebegin', newEntry);
    }
}
