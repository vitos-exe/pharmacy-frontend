import AbstractView from './AbstractView.js';
import { createElementAndDoStuff } from '../Utils.js';

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

        medicineOperations.appendChild(searchBar);

        medicineList.appendChild(medicineOperations);
    }

    async render() {
        const response = await fetch('http://localhost:8080/medicine/');
        const fetchedData = await response.json();
        const medicineGridEntities = fetchedData.map((e) => this.getMedicineGridEntity(e));

        document.querySelector('.medicine-grid').append(...medicineGridEntities);
    }

    getMedicineGridEntity(data) {
        const entity = createElementAndDoStuff('div', 'medicine-entity');

        const info = createElementAndDoStuff('div', 'entity-info');
        info.append(
            createElementAndDoStuff('div', 'main-info-field', data.name),
            createElementAndDoStuff('div', 'info-field', `$${data.price}`),
        );
        entity.appendChild(info);

        const buttons = createElementAndDoStuff('div', 'entity-buttons');

        const moreInfoButton = createElementAndDoStuff('button', 'more-info-button', 'More info');
        moreInfoButton.addEventListener('click', (e) => {
            if (document.querySelector('.medicine-info-dialog') === null) this.openMedicineMoreInfoModal(data.id);
        });
        buttons.append(moreInfoButton);

        const role = sessionStorage.getItem('userRole');
        if (role === 'user') {
            const addToOrderButton = createElementAndDoStuff('button', 'add-to-order-button', 'Add to order');
            addToOrderButton.addEventListener('click', (e) => this.addToCart(data));
            buttons.append(addToOrderButton);
        } else if (role === 'admin') {
            const editButton = createElementAndDoStuff('button', 'edit-button', 'Edit');
            editButton.addEventListener('click', (e) => this.openMedicineEditModal(data.id));
            buttons.append(editButton);
        }

        entity.appendChild(buttons);

        return entity;
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
            createElementAndDoStuff('p', 'info-field', `Description: ${medicineInfo.desciption}`),
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
