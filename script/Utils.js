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

export {createElementAndDoStuff};