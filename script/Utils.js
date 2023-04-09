function createElementAndDoStuff(elementName, className = null, text = null){
    var element = document.createElement(elementName);
    if (className !== null){
        element.className = className;
    }
    if (text !== null){
        element.textContent = text;
    }
    return element;
}

function getFormGroup(field, required = true) {
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

export {createElementAndDoStuff, getFormGroup};