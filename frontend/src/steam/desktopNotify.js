const CLIENT_NOTIFICATION_FRIEND_MESSAGE = 8;
let nextDesktopNotificationId = 0x52000000;

function protoString(field, value) {
    const bytes = Array.from(new TextEncoder().encode(value));
    const header = [(field << 3) | 2];
    let length = bytes.length;
    while (length > 0x7f) {
        header.push((length & 0x7f) | 0x80);
        length >>>= 7;
    }
    header.push(length);
    return header.concat(bytes);
}

function encodeFriendMessage(message) {
    const fields = [message.tag, message.steamid, message.title, message.body, message.icon];
    const bytes = fields.flatMap((value, index) => (value ? protoString(index + 1, value) : []));
    return new Uint8Array(bytes);
}

function removeFromSteamTray(store, id) {
    const tray = store.m_rgNotificationTray;
    if (!tray || typeof tray.length !== "number") return;

    let changed = false;
    for (let i = tray.length - 1; i >= 0; i--) {
        const notifications = tray[i]?.notifications;
        if (!notifications) continue;
        const at = notifications.findIndex((notification) => notification.notificationID === id);
        if (at < 0) continue;
        notifications.splice(at, 1);
        if (notifications.length === 0) tray.splice(i, 1);
        changed = true;
    }
    if (changed) store.m_cbkNotificationTray?.Dispatch?.(tray);
}

function showDesktopNotification(entry) {
    const store = window.NotificationStore;
    if (typeof store?.OnNotification !== "function") {
        warn("Steam desktop notifications are not available");
        return;
    }

    const steamid = entry.steamid || currentUserId();
    if (!steamid) return;

    const id = nextDesktopNotificationId++;
    const bytes = encodeFriendMessage({
        tag: "message_" + toAccountId(steamid),
        steamid,
        title: entry.title,
        body: entry.body,
        icon: entry.avatar,
    });

    try {
        store.OnNotification(id, CLIENT_NOTIFICATION_FRIEND_MESSAGE, bytes);
        removeFromSteamTray(store, id);
    } catch (err) {
        warn("desktop notification failed", err);
    }
}
