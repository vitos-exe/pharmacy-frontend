import { createElementAndDoStuff } from '../Utils.js';

export default class {
    constructor(title) {
        document.title = title;
        document.querySelector('header').innerHTML = '';
        document.querySelector('main').innerHTML = '';
        this.createNavbar();
    }

    createNavbar() {
        const { userRole } = sessionStorage;

        const navbar = createElementAndDoStuff('nav', 'navbar');

        const logo = createElementAndDoStuff('a', 'logo', 'Pharmacy Service');
        logo.href = '/';
        logo.setAttribute('data-link', '');

        const navLinks = createElementAndDoStuff('ul', 'nav-links');
        navLinks.append(
            ...(userRole === undefined ? this.getUnauthorizedLinks() : this.getAuthorizedLinks()),
        );

        navbar.append(logo, navLinks);

        if (userRole === 'user') {
            navbar.appendChild(this.getCart());
        }

        document.querySelector('header').appendChild(navbar);
    }

    getUnauthorizedLinks() {
        const login = createElementAndDoStuff('li', 'login-element');
        const loginLink = createElementAndDoStuff('a', null, 'Log in');
        loginLink.addEventListener('click', () => {
            if (document.querySelector('.login-dialog') === null) {
                this.openLoginDialog();
            }
        });
        login.appendChild(loginLink);

        const signup = createElementAndDoStuff('li', 'signup-element');
        const signupLink = createElementAndDoStuff('a', null, 'Sign up');
        signupLink.addEventListener('click', () => {
            if (document.querySelector('.user-create-dialog') === null) {
                this.openSignupDialog();
            }
        });
        signup.appendChild(signupLink);

        return Array.of(login, signup);
    }

    getAuthorizedLinks() {
        const links = [];
        if (sessionStorage.userRole === 'admin') {
            const users = createElementAndDoStuff('li');
            const usersLinks = createElementAndDoStuff('a', null, 'Users');
            usersLinks.href = '/users';
            usersLinks.setAttribute('data-link', '');
            users.appendChild(usersLinks);
            links.push(users);
        }

        const orders = createElementAndDoStuff('li');
        const ordersLink = createElementAndDoStuff('a', null, 'Orders');
        ordersLink.href = '/orders';
        ordersLink.setAttribute('data-link', '');
        orders.appendChild(ordersLink);

        const edit = createElementAndDoStuff('li', 'edit-element');
        const editLink = createElementAndDoStuff('a', null, 'Edit account');
        editLink.addEventListener('click', () => this.openEditAccountModal());
        edit.appendChild(editLink);

        const logout = createElementAndDoStuff('li');
        const logoutLink = createElementAndDoStuff('a', 'logout-button', 'Log out');
        logoutLink.href = '/';
        logoutLink.setAttribute('data-link', '');
        logoutLink.addEventListener('click', () => sessionStorage.removeItem('userRole'));
        logout.appendChild(logoutLink);

        links.push(orders, edit, logout);

        return links;
    }

    getCart() {
        const cart = createElementAndDoStuff('div', 'cart-div');

        const cartImg = createElementAndDoStuff('img', 'cart-img');
        cartImg.src = '../../pictures/cart.png';
        cartImg.alt = 'Cart';

        const orderForm = createElementAndDoStuff('form', 'order-form');
        const submitButton = createElementAndDoStuff('button', 'form-submit-btn', 'Submit order');
        submitButton.type = 'submit';
        orderForm.append(
            createElementAndDoStuff('div', 'dialog-top'),
            submitButton,
        );

        cart.append(cartImg, orderForm);

        return cart;
    }

    openLoginDialog() {
        const loginDialog = createElementAndDoStuff('div', 'login-dialog');

        const loginHeader = createElementAndDoStuff('div', 'login-dialog-header');
        const closeButton = createElementAndDoStuff('button', 'dialog-close', 'x');
        closeButton.addEventListener('click', () => document.querySelector('.nav-links').removeChild(loginDialog));
        loginHeader.append(
            createElementAndDoStuff('h2', null, 'Log in'),
            closeButton,
        );

        const loginForm = createElementAndDoStuff('form', 'login-dialog-form');

        const submitButton = createElementAndDoStuff('button', 'submit-btn', 'Submit');
        submitButton.type = 'submit';
        submitButton.href = '\\';

        loginForm.append(
            ...['email', 'password'].map((field) => this.getFormGroup(field)),
            submitButton,
        );

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.doLogin(e.target);
        });

        loginDialog.append(loginHeader, loginForm);

        document.querySelector('.login-element').insertAdjacentElement('afterend', loginDialog);
    }

    openSignupDialog() {
        const signupDialog = createElementAndDoStuff('div', 'user-create-dialog');

        const signupHeader = createElementAndDoStuff('div', 'user-create-dialog-header');
        const closeButton = createElementAndDoStuff('button', 'dialog-close', 'x');
        closeButton.addEventListener('click', () => document.querySelector('.nav-links').removeChild(signupDialog));
        signupHeader.append(
            createElementAndDoStuff('h2', null, 'Sign up'),
            closeButton,
        );

        const signupForm = createElementAndDoStuff('form', 'user-create-dialog-form');

        const submitButton = createElementAndDoStuff('button', 'submit-btn', 'Submit');
        submitButton.type = 'submit';

        signupForm.append(
            ...['name', 'email', 'address', 'password', 'password-confirm'].map((field) => this.getFormGroup(field)),
            submitButton,
        );

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.doSignup(signupForm);
        });

        signupDialog.append(signupHeader, signupForm);

        document.querySelector('.signup-element').insertAdjacentElement('afterend', signupDialog);
    }

    getFormGroup(field, required = true) {
        const group = createElementAndDoStuff('div', 'form-group');
        let name; let
            type;
        if (field === 'password-confirm') {
            name = 'Confirm password';
            type = 'password';
        } else {
            name = field[0].toUpperCase() + field.slice(1);
            type = ['password', 'email'].includes(field) ? field : 'text';
        }
        const label = createElementAndDoStuff('label', null, name);
        label.setAttribute('for', `user-${field}`);

        const input = createElementAndDoStuff('input');

        input.type = type;
        input.id = `user-${field}`;
        input.name = `user-${field}`;
        input.required = required;

        group.append(label, input);

        return group;
    }

    async doLogin(form) {
        const formValues = {};

        const formGroups = form.getElementsByClassName('form-group');
        for (let i = 0; i < formGroups.length; i += 1) {
            const formGroup = formGroups[i];

            const label = formGroup.querySelector('label');
            const input = formGroup.querySelector('input');

            if (label && input) {
                const key = label.getAttribute('for');
                const { value } = input;
                formValues[key] = value;
            }
        }

        const encodedAuth = btoa(`${formValues['user-email']}:${formValues['user-password']}`);

        const response = await fetch('http://localhost:8080/user/me', {
            headers: {
                Authorization: `Basic ${encodedAuth}`,
            },
        });

        if (response.status === 401) {
            alert('Invalid email or password');
        } else {
            const user = await response.json();
            sessionStorage.userRole = user.role;
            sessionStorage.userId = user.id;
            sessionStorage.userEmail = user.email;
            sessionStorage.userPassword = formValues['user-password'];

            const submitButton = document.querySelector('.submit-btn');
            submitButton.setAttribute('data-link', '');
            submitButton.click();
        }
    }

    async doSignup(form) {
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
        if (formValues.password !== formValues['password-confirm']) {
            alert("Passwords don't match");
            return;
        }

        delete formValues['password-confirm'];

        const response = await fetch('http://localhost:8080/user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formValues),
        });

        if (response.status !== 201) {
            alert(await response.text());
        } else {
            alert('User was created');
            document.querySelector('.nav-links').removeChild(document.querySelector('.user-create-dialog'));
        }
    }

    openEditAccountModal() {
        const editAccountDialog = createElementAndDoStuff('div', 'user-edit-dialog');

        const editHeader = createElementAndDoStuff('div', 'user-edit-dialog-header');
        const closeButton = createElementAndDoStuff('button', 'dialog-close', 'x');
        closeButton.addEventListener('click', () => document.querySelector('.nav-links').removeChild(editAccountDialog));
        editHeader.append(
            createElementAndDoStuff('h2', null, 'Edit account'),
            closeButton,
        );

        const editForm = createElementAndDoStuff('form', 'user-edit-dialog-form');

        const deleteButton = createElementAndDoStuff('button', 'btn-delete', 'Delete');
        deleteButton.addEventListener('click', this.deleteUser);

        const submitButton = createElementAndDoStuff('button', 'submit-btn', 'Submit');
        submitButton.type = 'submit';

        editForm.append(
            ...['name', 'email', 'address', 'password', 'password-confirm'].map((field) => this.getFormGroup(field, false)),
            deleteButton,
            submitButton,
        );

        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.editAccount(editForm);
        });

        editAccountDialog.append(editHeader, editForm);

        document.querySelector('.edit-element').insertAdjacentElement('afterend', editAccountDialog);
    }

    async deleteUser() {
        const encodedAuth = btoa(`${sessionStorage.userEmail}:${sessionStorage.userPassword}`);

        const response = await fetch(`http://localhost:8080/user/${sessionStorage.userId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Basic ${encodedAuth}`,
            },
        });

        if (response.status !== 200) {
            alert(await response.text());
        } else {
            alert('Your account was deleted');
            sessionStorage.removeItem('userId');
            document.querySelector('.logout-button').click();
        }
    }

    async editAccount(form) {
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

        if ((Object.prototype.hasOwnProperty.call(formValues, 'password')
            || Object.prototype.hasOwnProperty.call(formValues, 'password-confirm'))
                && (formValues.password !== formValues['password-confirm'])) {
            alert("Password doens't match!");
        }

        if (Object.prototype.hasOwnProperty.call(formValues, 'password-confirm')) {
            delete formValues['password-confirm'];
        }

        const encodedAuth = btoa(`${sessionStorage.userEmail}:${sessionStorage.userPassword}`);

        const response = await fetch(`http://localhost:8080/user/${sessionStorage.userId}`, {
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
            alert('Account was changed');
            document.querySelector('.nav-links').removeChild(document.querySelector('.user-edit-dialog'));
            if (Object.prototype.hasOwnProperty.call(formValues, 'password')) {
                sessionStorage.userPassword = formValues.password;
            }
            if (Object.prototype.hasOwnProperty.call(formValues, 'email')) {
                sessionStorage.userEmail = formValues.email;
            }
        }
    }
}
