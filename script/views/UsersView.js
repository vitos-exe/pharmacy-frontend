import AbstractView from './AbstractView.js';
import { createElementAndDoStuff } from '../Utils.js';

export default class extends AbstractView {
    constructor() {
        if (sessionStorage.userRole === undefined) {
            throw new Error(401);
        }
        if (sessionStorage.userRole !== 'admin') {
            throw new Error(403);
        }

        super('Users');
        const main = document.querySelector('main');
        const usersList = createElementAndDoStuff('section', 'users-list');
        main.appendChild(usersList);
        const users = createElementAndDoStuff('table', 'users-table');
        const tableHead = createElementAndDoStuff('thead');
        const tableHeadRow = createElementAndDoStuff('tr');
        tableHeadRow.append(
            createElementAndDoStuff('th', null, 'User ID'),
            createElementAndDoStuff('th', null, 'Email'),
            createElementAndDoStuff('th', null, 'Role'),
            createElementAndDoStuff('th', null, 'Address'),
            createElementAndDoStuff('th', null, 'Actions'),
        );
        tableHead.appendChild(tableHeadRow);
        users.append(
            tableHead,
            createElementAndDoStuff('tbody', 'users-table-body'),
        );

        usersList.append(users);
    }

    async render() {
        const response = await fetch('http://localhost:8080/user/', {
            headers: {
                Authorization: `Basic ${btoa(`${sessionStorage.userEmail}:${sessionStorage.userPassword}`)}`,
            },
        });
        const fetchedData = await response.json();
        const userTableEntities = fetchedData.map((e) => this.getUserTableEntity(e));

        document.querySelector('.users-table-body').append(...userTableEntities);
    }

    getUserTableEntity(data) {
        const row = createElementAndDoStuff('tr');
        row.id = data.id;

        const actionColumn = createElementAndDoStuff('td', 'action-column');

        const changeRoleButton = createElementAndDoStuff('button', 'change-role-btn', 'Change role');
        changeRoleButton.addEventListener('click', () => this.changeUserRole(data.id));

        const deteleUserButton = createElementAndDoStuff('button', 'delete-user-button', 'Delete user');
        deteleUserButton.addEventListener('click', () => this.deleteUser(data.id));

        actionColumn.append(changeRoleButton, deteleUserButton);

        row.append(
            createElementAndDoStuff('td', null, data.id),
            createElementAndDoStuff('td', null, data.email),
            createElementAndDoStuff('td', null, data.role),
            createElementAndDoStuff('td', null, data.address),
            actionColumn,
        );

        return row;
    }

    static async changeUserRole(id) {
        const roleCell = document.getElementById(id).children[2];

        await fetch(`http://localhost:8080/user/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Basic ${btoa(`${sessionStorage.userEmail}:${sessionStorage.userPassword}`)}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                role: roleCell.textContent === 'user' ? 'admin' : 'user',
            }),
        });

        roleCell.innerHTML = roleCell.textContent === 'user' ? 'admin' : 'user';
    }

    static async deleteUser(id) {
        await fetch(`http://localhost:8080/user/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Basic ${btoa(`${sessionStorage.userEmail}:${sessionStorage.userPassword}`)}`,
            },
        });

        document.getElementById(id).remove();
    }
}
