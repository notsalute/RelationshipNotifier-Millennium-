const hookedWindows = new WeakSet();

function hookHotkeys(win) {
    if (!win || hookedWindows.has(win)) return;
    hookedWindows.add(win);

    win.addEventListener("keydown", (event) => {
        if (event.key !== "F4" || event.repeat || event.altKey || event.ctrlKey) return;
        event.preventDefault();
        testNotification();
    });
}
