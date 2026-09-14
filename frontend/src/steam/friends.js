const getFriendStore = () => window.g_FriendsUIApp?.FriendStore;

function toSteamId64(accountid) {
    return (STEAMID64_BASE + BigInt(accountid)).toString();
}

function toAccountId(steamid) {
    return Number(BigInt(steamid) - STEAMID64_BASE);
}

function steamIdString(steamid) {
    try {
        return typeof steamid === "string" ? steamid : steamid?.ConvertTo64BitString?.() || null;
    } catch {
        return null;
    }
}

function currentUserId() {
    try {
        return window.App?.m_CurrentUser?.strSteamID || steamIdString(getFriendStore()?.self?.persona?.m_steamid);
    } catch {
        return null;
    }
}

function readFriends() {
    const store = getFriendStore();
    const accountids = store?.m_setFriendAccountIDs;
    if (!accountids || typeof accountids[Symbol.iterator] !== "function") return null;

    const friends = {};
    for (const accountid of accountids) {
        if (!accountid) continue;

        let player;
        try {
            player = store.m_mapPlayerCache?.get(accountid) || store.GetPlayer?.(accountid);
        } catch {}

        const persona = player?.persona || {};
        friends[toSteamId64(accountid)] = {
            name: persona.m_strPlayerName || "",
            avatar: persona.avatar_url_medium || persona.avatar_url || "",
        };
    }
    return friends;
}

function blockedByMe(steamid) {
    try {
        return !!getFriendStore()?.m_mapPlayerCache?.get(toAccountId(steamid))?.is_blocked;
    } catch {
        return false;
    }
}
