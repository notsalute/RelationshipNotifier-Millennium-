const selfActions = new Map();

function trackSelfActions() {
    const store = getFriendStore();
    if (!store || store.__relationshipNotifierHooked) return;

    const removeFriend = store.RemoveFriendBySteamID;
    if (typeof removeFriend === "function") {
        store.RemoveFriendBySteamID = function (steamid, ...rest) {
            const id = steamIdString(steamid);
            if (id && selfActions.get(id) !== "blocked") selfActions.set(id, "unfriended");
            return removeFriend.call(this, steamid, ...rest);
        };
    }

    const blockPlayer = store.BlockPlayer;
    if (typeof blockPlayer === "function") {
        store.BlockPlayer = function (player, unblock = false, ...rest) {
            const id = steamIdString(player?.persona?.m_steamid);
            if (id && !unblock) selfActions.set(id, "blocked");
            return blockPlayer.call(this, player, unblock, ...rest);
        };
    }

    store.__relationshipNotifierHooked = true;
}

function takeSelfAction(steamid) {
    const action = selfActions.get(steamid) || (blockedByMe(steamid) ? "blocked" : null);
    selfActions.delete(steamid);
    return action;
}
