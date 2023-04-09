import AbstractView from './AbstractView.js';
import { createElementAndDoStuff } from '../Utils.js';

export default class extends AbstractView {
    constructor() {
        if (sessionStorage.userRole === undefined) {
            throw new Error(401);
        }
        super('Orders');
        const main = document.querySelector('main');

        const ordersList = createElementAndDoStuff('section', 'orders-list');
        main.appendChild(ordersList);

        let orders;

        if (sessionStorage.userRole === 'user') {
            orders = createElementAndDoStuff('div', 'orders-grid');
            this.render = this.renderForUser;
        } else if (sessionStorage.userRole === 'admin') {
            orders = createElementAndDoStuff('table', 'orders-table');
            const tableHead = createElementAndDoStuff('thead');
            const tableHeadRow = createElementAndDoStuff('tr');
            tableHeadRow.append(
                createElementAndDoStuff('th', null, 'Order ID'),
                createElementAndDoStuff('th', null, 'Time'),
                createElementAndDoStuff('th', null, 'Status'),
                createElementAndDoStuff('th', null, 'Actions'),
            );
            tableHead.appendChild(tableHeadRow);
            orders.append(
                tableHead,
                createElementAndDoStuff('tbody', 'orders-table-body'),
            );
            this.render = this.renderForAdmin;
        }

        ordersList.append(orders);
    }

    async renderForUser() {
        const response = await fetch('http://localhost:8080/order/my', {
            headers: {
                Authorization: `Basic ${btoa(`${sessionStorage.userEmail}:${sessionStorage.userPassword}`)}`,
            },
        });
        const fetchedData = await response.json();
        const orderGridEntities = fetchedData.map((e) => this.getOrderGridEntity(e));

        document.querySelector('.orders-grid').append(...orderGridEntities);
    }

    async renderForAdmin() {
        const response = await fetch('http://localhost:8080/order/', {
            headers: {
                Authorization: `Basic ${btoa(`${sessionStorage.userEmail}:${sessionStorage.userPassword}`)}`,
            },
        });
        const fetchedData = await response.json();
        const orderTableEntities = fetchedData.map((e) => this.getOrderTableEntity(e));

        document.querySelector('.orders-table-body').append(...orderTableEntities);
    }

    getOrderGridEntity(data) {
        const entity = createElementAndDoStuff('div', 'order-entity');
        entity.id = data.id;

        const info = createElementAndDoStuff('div', 'entity-info');
        info.append(
            createElementAndDoStuff('div', 'main-info-field', `Order ${data.id}`),
            createElementAndDoStuff('div', 'info-field', `${new Date(data.create_time)
                .toISOString().slice(0, 19).replace('T', ' ')}`),
            createElementAndDoStuff('div', 'info-field', `${data.status}`),
        );
        entity.appendChild(info);

        const buttons = createElementAndDoStuff('div', 'entity-buttons');

        const moreInfoButton = createElementAndDoStuff('button', 'order-details-button', 'More info');
        moreInfoButton.addEventListener('click', () => {
            if (document.querySelector('.order-details-dialog') === null) this.openOrderDetailsDialog(data.id);
        });
        buttons.append(moreInfoButton);

        entity.appendChild(buttons);

        return entity;
    }

    getOrderTableEntity(data) {
        const row = createElementAndDoStuff('tr');
        row.id = data.id;

        const actionColumn = createElementAndDoStuff('td', 'action-column');

        const changeStatusBotton = createElementAndDoStuff('button', 'change-status-btn', 'Change status');
        changeStatusBotton.addEventListener('click', () => this.changeOrderStatus(data.id));

        const orderDetailsBotton = createElementAndDoStuff('button', 'order-details-button', 'More info');
        orderDetailsBotton.addEventListener('click', () => this.openOrderDetailsDialog(data.id));

        actionColumn.append(changeStatusBotton, orderDetailsBotton);

        row.append(
            createElementAndDoStuff('td', null, data.id),
            createElementAndDoStuff('td', null, new Date(data.create_time)
                .toISOString().slice(0, 19).replace('T', ' ')),
            createElementAndDoStuff('td', null, data.status),
            actionColumn,
        );
        return row;
    }

    static async openOrderDetailsDialog(id) {
        const orderDetailsDialog = createElementAndDoStuff('div', 'order-details-dialog');
        const closeButton = createElementAndDoStuff('button', 'close-button', 'Close');
        closeButton.addEventListener('click', () => document.querySelector('.orders-list').removeChild(orderDetailsDialog));

        const table = createElementAndDoStuff('table');
        const tableBody = createElementAndDoStuff('tbody', 'order-details-body');
        table.appendChild(tableBody);

        const data = await fetch(`http://localhost:8080/order/${id}`, {
            headers: {
                Authorization: `Basic ${btoa(`${sessionStorage.userEmail}:${sessionStorage.userPassword}`)}`,
            },
        }).then((r) => r.json());

        data.order_items.forEach((element) => {
            const tableRow = createElementAndDoStuff('tr');
            tableRow.append(
                createElementAndDoStuff('td', null, element.name),
                createElementAndDoStuff('td', null, `${element.quantity} units`),
            );
            tableBody.appendChild(tableRow);
        });

        orderDetailsDialog.append(createElementAndDoStuff('div', 'dialog-top'), table, closeButton);
        document.querySelector('.orders-list').insertAdjacentElement('beforeend', orderDetailsDialog);
    }

    static async changeOrderStatus(id) {
        const statusCell = document.getElementById(id).children[2];

        await fetch(`http://localhost:8080/order/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Basic ${btoa(`${sessionStorage.userEmail}:${sessionStorage.userPassword}`)}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: statusCell.textContent === 'pending' ? 'delivered' : 'pending',
            }),
        });

        statusCell.innerHTML = statusCell.textContent === 'pending' ? 'delivered' : 'pending';
    }
}
