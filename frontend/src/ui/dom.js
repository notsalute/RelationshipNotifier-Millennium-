function make(doc, tag, className, text) {
    const node = doc.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function avatarElement(doc, item, className) {
    let node;
    if (item.avatar) {
        node = doc.createElement("img");
        node.src = item.avatar;
    } else {
        node = doc.createElement("div");
        node.appendChild(svgIcon(doc, item.kind));
    }
    node.className = className;
    return node;
}
