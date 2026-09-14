function scanWindows() {
    trackSelfActions();
    hookHotkeys(window);

    for (const popup of getPopups()) {
        try {
            hookHotkeys(popup?.m_popup);
            watchForTray(popup?.m_popup?.document);
        } catch {}
    }
}

function start() {
    installMillenniumTab();
    scanWindows();
    listeners.add(renderAllTrays);

    setInterval(scanWindows, WINDOW_SCAN_MS);
    setTimeout(poll, STARTUP_DELAY_MS);
    setInterval(poll, POLL_MS);

    window.RelationshipNotifier = {
        poll,
        readFriends,
        testNotification,
        status,
        get history() {
            return history;
        },
    };
    log("started");
}

const plugin = M.definePlugin(() => {
    start();
    return {
        title: "RelationshipNotifier",
        icon: h(M.IconsModule.Settings, null),
        content: h(SettingsPanel, null),
    };
});
