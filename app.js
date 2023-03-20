let dialogIsOpen = false;

let openDialog  = function(element_class) {
    let dialog = document.querySelector(element_class)
    if (!(dialogIsOpen) && ((dialog.style.display == '') || (dialog.style.display == 'none'))) {
        dialog.style.display = 'block'
        dialogIsOpen = true
    }
}

let closeDialog = function(element_class) {
    let dialog = document.querySelector(element_class)
    if (dialog.style.display == 'block') {
        dialog.style.display = 'none'
        dialogIsOpen = false
    }
}

let editButtons = document.getElementsByClassName("edit-button")
for (let i = 0; i < editButtons.length; i++) {
    editButtons[i].onclick = function() {
      openDialog(".medicine-edit-dialog")
    }
}

let moreInfoButtons = document.getElementsByClassName("more-info-button")
for (let i = 0; i < moreInfoButtons.length; i++) {
    moreInfoButtons[i].onclick = function() {
      openDialog(".medicine-info-dialog")
    }
}

let orderDetailsButtons = document.getElementsByClassName("order-details-button")
for (let i = 0; i < orderDetailsButtons.length; i++) {
    orderDetailsButtons[i].onclick = function() {
      openDialog(".order-details-dialog")
    }
}

const user = { email: 'user@example.com', password: '1234' };
const admin = { email: 'admin@example.com', password: '1234' };
const form = document.querySelector('.login-dialog-form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const email = formData.get('user-email');
    const password = formData.get('user-password');
    if (email === user.email && password === user.password) {
        window.location.href = './user-pages/user-medicine.html';
        closeDialog('.login-dialog')
    } else if (email === admin.email && password === admin.password) {
        window.location.href = './admin-pages/admin-medicine.html';
        closeDialog('.login-dialog')
    } else {
        alert('Invalid credentials')
    }
});