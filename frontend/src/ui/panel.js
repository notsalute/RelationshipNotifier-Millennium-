const HISTORY_PREVIEW = 5;
const MUTED = "#8b929a";
const DIVIDER = "1px solid rgba(255,255,255,0.06)";

const PANEL_STYLE = { display: "flex", flexDirection: "column", gap: "18px", paddingBottom: "16px" };
const ROW_STYLE = { display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" };
const BUTTON_STYLE = { width: "auto", minWidth: 0, padding: "6px 14px" };
const SMALL_BUTTON_STYLE = { width: "auto", minWidth: 0, padding: "4px 10px", fontSize: "12px" };
const CARD_STYLE = { background: "rgba(255,255,255,0.04)", borderRadius: "4px", overflow: "hidden" };
const SECTION_HEAD_STYLE = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "8px" };
const SECTION_TITLE_STYLE = { fontSize: "12px", fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" };
const GRID_STYLE = { display: "grid", gridTemplateColumns: "minmax(0,1fr) 72px 72px 84px", alignItems: "center", gap: "8px", padding: "8px 12px" };
const GRID_HEAD_STYLE = { ...GRID_STYLE, paddingBottom: "6px", fontSize: "11px", fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" };
const CENTER_STYLE = { display: "flex", justifyContent: "center", alignItems: "center", gap: "4px" };
const ELLIPSIS_STYLE = { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
const COLOR_INPUT_STYLE = { width: "32px", height: "22px", padding: 0, border: "none", borderRadius: "3px", background: "transparent", cursor: "pointer" };
const ICON_BUTTON_STYLE = { width: "20px", height: "20px", padding: 0, border: "none", borderRadius: "3px", background: "transparent", color: MUTED, cursor: "pointer", fontSize: "14px", lineHeight: "20px" };

const NOTIFY_HELP = "Popup inside Steam and an entry in the bell";
const DESKTOP_HELP = "Steam's own popup in the corner of your screen, even when Steam is minimized. Follows your Friends & Chat notification settings.";

function useStoreUpdates() {
    const [, setTick] = React.useState(0);
    React.useEffect(() => {
        const rerender = () => setTick((tick) => tick + 1);
        listeners.add(rerender);
        return () => listeners.delete(rerender);
    }, []);
}

function statusLine() {
    const lastCheck = status.lastCheck ? " Last check " + new Date(status.lastCheck).toLocaleTimeString() + "." : "";
    return "Tracking " + status.tracking + " friends. " + status.note + lastCheck;
}

function Section({ title, action, children }) {
    return h("div", null,
        h("div", { style: SECTION_HEAD_STYLE }, h("div", { style: SECTION_TITLE_STYLE }, title), action || null),
        h("div", { style: CARD_STYLE }, children));
}

function Switch({ value, disabled, label, onChange }) {
    if (!M.Toggle) {
        return h("input", { type: "checkbox", checked: value, disabled, "aria-label": label, onChange: (event) => onChange(event.target.checked) });
    }
    return h("div", { title: label, style: disabled ? { opacity: 0.35, pointerEvents: "none" } : null },
        h(M.Toggle, { value, disabled, onChange }));
}

function AlertRow({ kind, description }) {
    const enabled = isKindEnabled(kind);
    const accent = kindAccent(kind);
    const custom = hasCustomColor(kind);

    return h("div", { style: { ...GRID_STYLE, borderTop: DIVIDER } },
        h("div", { style: { display: "flex", alignItems: "center", gap: "10px", minWidth: 0, opacity: enabled ? 1 : 0.5 }, title: description },
            h("span", { style: { width: "3px", height: "30px", borderRadius: "2px", background: accent, flex: "none" } }),
            h("div", { style: { minWidth: 0 } },
                h("div", { style: { fontWeight: 600, fontSize: "14px", ...ELLIPSIS_STYLE } }, kindInfo(kind).label),
                h("div", { style: { fontSize: "12px", color: MUTED, ...ELLIPSIS_STYLE } }, description))),
        h("div", { style: CENTER_STYLE },
            h(Switch, { value: enabled, label: NOTIFY_HELP, onChange: (value) => setKindEnabled(kind, value) })),
        h("div", { style: CENTER_STYLE },
            h(Switch, {
                value: enabled && isDesktopEnabled(kind),
                disabled: !enabled,
                label: DESKTOP_HELP,
                onChange: (value) => setDesktopEnabled(kind, value),
            })),
        h("div", { style: CENTER_STYLE },
            h("input", {
                type: "color",
                value: accent,
                title: "Change color",
                style: COLOR_INPUT_STYLE,
                onChange: (event) => setKindColor(kind, event.target.value),
            }),
            h("button", {
                title: "Reset color",
                style: { ...ICON_BUTTON_STYLE, visibility: custom ? "visible" : "hidden" },
                onClick: () => resetKindColor(kind),
            }, "↺")));
}

function AlertsSection() {
    const Button = M.DialogButton || "button";
    const anyCustom = SETTING_KINDS.some(({ kind }) => hasCustomColor(kind));
    const resetColors = anyCustom ? h(Button, { style: SMALL_BUTTON_STYLE, onClick: resetAllColors }, "Reset colors") : null;

    return h(Section, { title: "Alerts", action: resetColors },
        h("div", { style: GRID_HEAD_STYLE },
            h("div", null, "Alert"),
            h("div", { style: { textAlign: "center" }, title: NOTIFY_HELP }, "Notify"),
            h("div", { style: { textAlign: "center" }, title: DESKTOP_HELP }, "Desktop"),
            h("div", { style: { textAlign: "center" } }, "Color")),
        SETTING_KINDS.map(({ kind, description }) => h(AlertRow, { key: kind, kind, description })));
}

function HistoryRow({ item }) {
    return h("div", {
        style: { display: "flex", gap: "10px", alignItems: "center", padding: "6px 12px", borderTop: DIVIDER, cursor: "pointer" },
        onClick: () => openProfile(item.steamid),
    },
        h("span", { style: { width: "3px", height: "28px", borderRadius: "2px", background: kindAccent(item.kind), flex: "none" } }),
        item.avatar
            ? h("img", { src: item.avatar, style: { width: 28, height: 28, borderRadius: 3, flex: "none" } })
            : h("div", { style: { width: 28, height: 28, flex: "none" } }),
        h("div", { style: { minWidth: 0, flex: 1 } },
            h("div", { style: { fontWeight: 600, fontSize: "13px", ...ELLIPSIS_STYLE } }, item.title),
            h("div", { style: { fontSize: "12px", color: MUTED, ...ELLIPSIS_STYLE } }, item.body)),
        h("div", { style: { fontSize: "12px", color: MUTED, whiteSpace: "nowrap" } }, new Date(item.time).toLocaleString()));
}

function HistorySection() {
    const Button = M.DialogButton || "button";
    const [expanded, setExpanded] = React.useState(false);
    const items = expanded ? history : history.slice(0, HISTORY_PREVIEW);
    const hidden = history.length - HISTORY_PREVIEW;
    const clear = history.length > 0 ? h(Button, { style: SMALL_BUTTON_STYLE, onClick: clearHistory }, "Clear all") : null;

    return h(Section, { title: "History" + (history.length ? " (" + history.length + ")" : ""), action: clear },
        history.length === 0
            ? h("div", { style: { padding: "12px", color: MUTED } }, "No changes yet.")
            : items.map((item) => h(HistoryRow, { key: entryKey(item), item })),
        hidden > 0
            ? h("div", { style: { padding: "8px 12px", borderTop: DIVIDER } },
                h(Button, { style: SMALL_BUTTON_STYLE, onClick: () => setExpanded(!expanded) },
                    expanded ? "Show less" : "Show all (" + hidden + " more)"))
            : null);
}

function SettingsPanel() {
    useStoreUpdates();
    const Button = M.DialogButton || "button";

    return h("div", { style: PANEL_STYLE },
        h("div", { style: { ...ROW_STYLE, justifyContent: "space-between" } },
            h("div", { style: { color: MUTED, fontSize: "13px" } }, statusLine()),
            h("div", { style: ROW_STYLE },
                h(Button, { style: BUTTON_STYLE, onClick: testNotification }, "Test notification"),
                h(Button, { style: BUTTON_STYLE, onClick: checkNow }, "Check now"))),
        h(AlertsSection, null),
        h(HistorySection, null));
}
