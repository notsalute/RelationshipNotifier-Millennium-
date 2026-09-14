function notify(kind, steamid, info, previousName) {
    if (kind !== "test" && !isKindEnabled(kind)) {
        log("muted", kind, steamid);
        return;
    }

    const meta = kindInfo(kind);
    const name = info?.name || "Unknown (" + steamid + ")";
    const [title, body] = meta.text(name, previousName);
    const entry = { kind, steamid, title, body, avatar: info?.avatar || "" };

    record(entry);
    if (meta.toast) showToast(entry);
    if (kind === "test" || isDesktopEnabled(kind)) showDesktopNotification(entry);
    log(kind, steamid, title);
}

const testNotification = () => notify("test", "", null);
