function getPopups() {
    const popups = window.g_PopupManager?.m_mapPopups;
    return popups && typeof popups.values === "function" ? Array.from(popups.values()) : [];
}

function getMainWindowDocument() {
    const open = getPopups().filter((popup) => popup?.m_popup?.document?.body);
    const main = open.find((popup) => /^SP (Desktop|BPM)/.test(popup.m_strName || "")) || open[0];
    return main ? main.m_popup.document : null;
}

function openProfile(steamid) {
    if (!steamid) return;
    try {
        SteamClient.URL.ExecuteSteamURL("steam://url/SteamIDPage/" + steamid);
    } catch (err) {
        warn("could not open profile", err);
    }
}
