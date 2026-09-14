const SETTING_KINDS = [
    { kind: "removed", description: "Someone removes or blocks you" },
    { kind: "deleted", description: "A friend's account no longer exists" },
    { kind: "added", description: "Someone new is on your friends list" },
    { kind: "renamed", description: "A friend changes their name" },
    { kind: "selfUnfriended", description: "You remove someone (bell, no in-Steam popup)" },
    { kind: "selfBlocked", description: "You block someone (bell, no in-Steam popup)" },
];

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

function loadSettings() {
    const stored = load(SETTINGS_KEY, {});
    const enabled = {};
    const desktop = {};
    const colors = {};
    for (const { kind } of SETTING_KINDS) {
        enabled[kind] = stored?.enabled?.[kind] !== false;
        desktop[kind] = stored?.desktop?.[kind] !== false;
        const color = stored?.colors?.[kind];
        if (typeof color === "string" && HEX_COLOR.test(color)) colors[kind] = color;
    }
    return { enabled, desktop, colors };
}

let settings = loadSettings();

function updateSettings(next) {
    settings = next;
    save(SETTINGS_KEY, settings);
    emit();
}

const isKindEnabled = (kind) => settings.enabled[kind] !== false;
const isDesktopEnabled = (kind) => settings.desktop[kind] !== false;
const kindAccent = (kind) => settings.colors[kind] || kindInfo(kind).accent;
const hasCustomColor = (kind) => !!settings.colors[kind];

function setKindEnabled(kind, enabled) {
    updateSettings({ ...settings, enabled: { ...settings.enabled, [kind]: !!enabled } });
}

function setDesktopEnabled(kind, enabled) {
    updateSettings({ ...settings, desktop: { ...settings.desktop, [kind]: !!enabled } });
}

function setKindColor(kind, color) {
    if (!HEX_COLOR.test(color)) return;
    updateSettings({ ...settings, colors: { ...settings.colors, [kind]: color.toLowerCase() } });
}

function resetKindColor(kind) {
    const colors = { ...settings.colors };
    delete colors[kind];
    updateSettings({ ...settings, colors });
}

function resetAllColors() {
    updateSettings({ ...settings, colors: {} });
}
