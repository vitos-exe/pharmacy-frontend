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

        const nav_links = createElementAndDoStuff('ul', 'nav-links');
        nav_links.append(...userRole === undefined
            ? this.getUnauthorizedLinks() : this.getAuthorizedLinks());

        navbar.append(logo, nav_links);

        if (userRole === 'user') {
            navbar.appendChild(this.getCart());
        }

        document.querySelector('header').appendChild(navbar);
    }

    getUnauthorizedLinks() {
        const login = createElementAndDoStuff('li', 'login-element');
        const login_link = createElementAndDoStuff('a', null, 'Log in');
        login_link.addEventListener('click', (e) => {
            if (document.querySelector('.login-dialog') === null) {
                this.openLoginDialog();
            }
        });
        login.appendChild(login_link);

        const signup = createElementAndDoStuff('li', 'signup-element');
        const signup_link = createElementAndDoStuff('a', null, 'Sign up');
        signup_link.addEventListener('click', (e) => {
            if (document.querySelector('.user-create-dialog') === null) {
                this.openSignupDialog();
            }
        });
        signup.appendChild(signup_link);

        return Array.of(login, signup);
    }

    getAuthorizedLinks() {
        const links = new Array();
        if (sessionStorage.userRole === 'admin') {
            const users = createElementAndDoStuff('li');
            const users_links = createElementAndDoStuff('a', null, 'Users');
            users_links.href = '/users';
            users_links.setAttribute('data-link', '');
            users.appendChild(users_links);
            links.push(users);
        }

        const orders = createElementAndDoStuff('li');
        const orders_link = createElementAndDoStuff('a', null, 'Orders');
        orders_link.href = '/orders';
        orders_link.setAttribute('data-link', '');
        orders.appendChild(orders_link);

        const edit = createElementAndDoStuff('li');
        const edit_link = createElementAndDoStuff('a', null, 'Edit account');
        edit_link.addEventListener('click', (e) => this.openEditAccountModal());
        edit.appendChild(edit_link);

        const logout = createElementAndDoStuff('li');
        const logout_link = createElementAndDoStuff('a', 'logout-button', 'Log out');
        logout_link.href = '/';
        logout_link.setAttribute('data-link', '');
        logout_link.addEventListener('click', (e) => sessionStorage.removeItem('userRole'));
        logout.appendChild(logout_link);

        links.push(orders, edit, logout);

        return links;
    }

    getCart() {
        const cart = createElementAndDoStuff('div', 'cart-div');

        const cart_img = createElementAndDoStuff('img', 'cart-img');
        cart_img.src = '../../pictures/cart.png';
        cart_img.alt = 'Cart';

        const order_form = createElementAndDoStuff('form', 'order-form');
        const submit_button = createElementAndDoStuff('button', 'form-submit-btn', 'Submit order');
        submit_button.type = 'submit';
        order_form.append(
            createElementAndDoStuff('div', 'dialog-top'),
            submit_button,
        );

        cart.append(cart_img, order_form);

        return cart;
    }

    openLoginDialog() {
        const login_dialog = createElementAndDoStuff('div', 'login-dialog');

        const login_header = createElementAndDoStuff('div', 'login-dialog-header');
        const closeButton = createElementAndDoStuff('button', 'dialog-close', 'x');
        closeButton.addEventListener('click', (e) => document.querySelector('.nav-links').removeChild(login_dialog));
        login_header.append(
            createElementAndDoStuff('h2', null, 'Log in'),
            closeButton,
        );

        const login_form = createElementAndDoStuff('form', 'login-dialog-form');

        const submit_button = createElementAndDoStuff('button', 'submit-btn', 'Submit');
        submit_button.type = 'submit';

        login_form.append(
            ...['email', 'password'].map((field) => this.getFormGroup(field)),
            submit_button,
        );

        login_form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.doLogin(e.target);
        });

        login_dialog.append(login_header, login_form);

        document.querySelector('.login-element').insertAdjacentElement('afterend', login_dialog);
    }

    openSignupDialog() {
        const signup_dialog = createElementAndDoStuff('div', 'user-create-dialog');

        const signup_header = createElementAndDoStuff('div', 'user-create-dialog-header');
        const closeButton = createElementAndDoStuff('button', 'dialog-close', 'x');
        closeButton.addEventListener('click', (e) => document.querySelector('.nav-links').removeChild(signup_dialog));
        signup_header.append(
            createElementAndDoStuff('h2', null, 'Sign up'),
            closeButton,
        );

        const signup_form = createElementAndDoStuff('form', 'user-create-dialog-form');

        const submit_button = createElementAndDoStuff('button', 'submit-btn', 'Submit');
        submit_button.type = 'submit';

        signup_form.append(
            ...['name', 'email', 'address', 'password', 'password-confirm'].map((field) => this.getFormGroup(field)),
            submit_button,
        );

        signup_dialog.append(signup_header, signup_form);

        document.querySelector('.signup-element').insertAdjacentElement('afterend', signup_dialog);
    }

    getFormGroup(field) {
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
        label.for = `user-${field}`;

        const input = createElementAndDoStuff('input');

        input.type = type;
        input.id = `user-${field}`;
        input.name = `user-${field}`;
        input.required = true;

        group.append(label, input);

        return group;
    }

    doLogin(form) {
        console.log(form);
    }
}
