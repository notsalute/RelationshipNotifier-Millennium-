const PANEL_STYLE = { display: "flex", flexDirection: "column", gap: "12px" };
const BUTTON_ROW_STYLE = { display: "flex", gap: "8px", flexWrap: "wrap" };
const BUTTON_STYLE = { width: "auto", minWidth: 0, padding: "6px 14px" };

function useStoreUpdates() {
    const [, setTick] = React.useState(0);
    React.useEffect(() => {
        const rerender = () => setTick((tick) => tick + 1);
        listeners.add(rerender);
        return () => listeners.delete(rerender);
    }, []);
}

function statusLine() {
    const lastCheck = status.lastCheck ? " Last check: " + new Date(status.lastCheck).toLocaleTimeString() + "." : "";
    return "Tracking " + status.tracking + " friends. " + status.note + lastCheck;
}

function HistoryRow({ item }) {
    const rowStyle = {
        display: "flex",
        gap: "10px",
        alignItems: "center",
        padding: "8px",
        borderRadius: "4px",
        background: "rgba(255,255,255,0.04)",
        borderLeft: "3px solid " + kindInfo(item.kind).accent,
        cursor: "pointer",
    };

    return h("div", { style: rowStyle, onClick: () => openProfile(item.steamid) },
        item.avatar ? h("img", { src: item.avatar, style: { width: 32, height: 32, borderRadius: 4 } }) : null,
        h("div", null,
            h("div", { style: { fontWeight: 600 } }, item.title),
            h("div", { style: { fontSize: 12, opacity: 0.7 } }, item.body + " - " + new Date(item.time).toLocaleString())));
}

function HistoryPanel() {
    useStoreUpdates();
    const Button = M.DialogButton || "button";

    return h("div", { style: PANEL_STYLE },
        h("div", { style: { opacity: 0.8 } }, statusLine()),
        h("div", { style: BUTTON_ROW_STYLE },
            h(Button, { style: BUTTON_STYLE, onClick: testNotification }, "Test notification"),
            h(Button, { style: BUTTON_STYLE, onClick: checkNow }, "Check now"),
            h(Button, { style: BUTTON_STYLE, onClick: clearHistory }, "Clear all")),
        history.length === 0
            ? h("div", { style: { opacity: 0.6 } }, "No changes yet.")
            : history.map((item) => h(HistoryRow, { key: entryKey(item), item })));
}
