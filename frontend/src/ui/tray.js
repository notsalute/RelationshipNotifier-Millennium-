const trayDocs = new Set();
const unreadWhenOpened = new WeakMap();

function findLeaf(doc, text) {
    for (const node of doc.body.getElementsByTagName("*")) {
        if (node.childElementCount === 0 && node.textContent.trim() === text) return node;
    }
    return null;
}

function findTrayAnchor(doc) {
    const heading = findLeaf(doc, "Notifications");
    if (!heading) return null;
    const viewAll = findLeaf(doc, "View All");
    if (!viewAll) return null;

    let row = heading.parentElement;
    while (row && !row.contains(viewAll)) row = row.parentElement;
    if (!row || row === doc.body) return null;

    if (row.textContent.trim().length > "NotificationsView All".length + 10) {
        let branch = viewAll;
        while (branch.parentElement !== row) branch = branch.parentElement;
        return branch;
    }
    return row;
}

function formatTrayTime(time) {
    const date = new Date(time);
    return date.toDateString() === new Date().toDateString()
        ? date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
        : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function findNativeCard(list) {
    const win = list.ownerDocument.defaultView;
    for (let node = list.nextElementSibling, depth = 0; node && depth < 5; depth++) {
        const background = win.getComputedStyle(node).backgroundColor;
        if (background && background !== "transparent" && background !== "rgba(0, 0, 0, 0)") return node;
        node = node.firstElementChild;
    }
    return null;
}

function matchNativeCards(list) {
    const card = findNativeCard(list);
    if (!card) return;

    const style = list.ownerDocument.defaultView.getComputedStyle(card);
    list.style.setProperty("--jn-bg", style.backgroundColor);
    list.style.setProperty("--jn-radius", style.borderRadius);
    list.style.setProperty("--jn-pad", style.padding);

    list.style.paddingLeft = list.style.paddingRight = "0px";
    const listRect = list.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const left = cardRect.left - listRect.left;
    const right = listRect.right - cardRect.right;
    if (left > 0 && left < 40) list.style.paddingLeft = left + "px";
    if (right > 0 && right < 40) list.style.paddingRight = right + "px";
}

function buildTrayHeader(doc) {
    const clear = make(doc, "button", "jn-tray-clear", "Clear all");
    clear.addEventListener("click", (event) => {
        event.stopPropagation();
        clearHistory();
    });

    const head = make(doc, "div", "jn-tray-head");
    head.append(make(doc, "span", null, "Friend alerts"), clear);
    return head;
}

function buildTrayItem(doc, item, unread) {
    const meta = make(doc, "div", "jn-tray-meta");
    meta.append(
        svgIcon(doc, item.kind),
        make(doc, "span", null, kindInfo(item.kind).label),
        make(doc, "span", "jn-tray-time", formatTrayTime(item.time)),
    );

    const text = make(doc, "div", "jn-tray-text");
    text.append(meta, make(doc, "div", "jn-tray-title", item.title), make(doc, "div", "jn-tray-body", item.body));

    const card = make(doc, "div", "jn-tray-item");
    card.style.setProperty("--jn-accent", kindInfo(item.kind).accent);
    card.append(avatarElement(doc, item, "jn-tray-img"), make(doc, "div", "jn-tray-bar"), text);
    if (unread) card.appendChild(make(doc, "div", "jn-tray-dot"));
    card.addEventListener("click", () => openProfile(item.steamid));
    return card;
}

function renderTray(doc) {
    const anchor = findTrayAnchor(doc);
    if (!anchor) return;

    const items = history.slice(0, TRAY_LIMIT);
    let unread = unreadWhenOpened.get(anchor);
    if (!unread) {
        unread = new Set(items.filter((item) => !item.read).map(entryKey));
        unreadWhenOpened.set(anchor, unread);
        markAllRead();
    }

    let list = Array.from(anchor.parentElement.children).find((node) => node.classList.contains("jn-tray"));
    if (items.length === 0) {
        list?.remove();
        return;
    }

    const signature = items.map((item) => entryKey(item) + (unread.has(entryKey(item)) ? "*" : "")).join("|");
    if (list && list.dataset.sig === signature) return;

    ensureStyles(doc);
    if (!list) {
        list = make(doc, "div", "jn-tray");
        anchor.after(list);
    }
    list.dataset.sig = signature;
    matchNativeCards(list);
    list.replaceChildren(buildTrayHeader(doc), ...items.map((item) => buildTrayItem(doc, item, unread.has(entryKey(item)))));
}

function renderAllTrays() {
    for (const doc of trayDocs) {
        try {
            renderTray(doc);
        } catch {
            trayDocs.delete(doc);
        }
    }
}

function watchForTray(doc) {
    if (!doc?.body || trayDocs.has(doc)) return;
    trayDocs.add(doc);

    let scheduled = false;
    const observer = new doc.defaultView.MutationObserver(() => {
        if (scheduled) return;
        scheduled = true;
        setTimeout(() => {
            scheduled = false;
            try {
                renderTray(doc);
            } catch (err) {
                warn("tray render failed", err);
            }
        }, TRAY_RENDER_DELAY_MS);
    });
    observer.observe(doc.body, { childList: true, subtree: true });
}
