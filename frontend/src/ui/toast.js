function getToastStack(doc) {
    let stack = doc.getElementById(TOAST_STACK_ID);
    if (!stack) {
        stack = make(doc, "div");
        stack.id = TOAST_STACK_ID;
        doc.body.appendChild(stack);
    }
    return stack;
}

function showToast(entry) {
    const doc = getMainWindowDocument();
    if (!doc) {
        try {
            new Notification(entry.title, { body: entry.body, icon: entry.avatar });
        } catch {}
        return;
    }

    ensureStyles(doc);

    const text = make(doc, "div");
    text.append(make(doc, "div", "jn-title", entry.title), make(doc, "div", "jn-body", entry.body));

    const card = make(doc, "div", "jn-toast");
    card.style.setProperty("--jn-accent", kindAccent(entry.kind));
    card.append(avatarElement(doc, entry, "jn-toast-img"), text);
    getToastStack(doc).appendChild(card);

    const dismiss = () => {
        card.classList.add("jn-out");
        setTimeout(() => card.remove(), 300);
    };
    card.addEventListener("click", () => {
        openProfile(entry.steamid);
        dismiss();
    });
    setTimeout(dismiss, TOAST_MS);
}
