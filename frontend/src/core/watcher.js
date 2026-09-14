const missingCount = new Map();
const pendingNames = new Map();
let polling = false;
let lastLoggedNote = "";

async function poll() {
    if (polling) return;
    polling = true;
    try {
        await pollOnce();
    } catch (err) {
        console.error(TAG, "poll failed", err);
    } finally {
        polling = false;
        if (status.note !== lastLoggedNote) {
            lastLoggedNote = status.note;
            log("status:", status.note, "(tracking " + status.tracking + ")");
        }
        emit();
    }
}

function checkNow() {
    missingCount.clear();
    poll();
}

async function pollOnce() {
    const me = currentUserId();
    const current = readFriends();
    if (!me || !current) {
        status.note = "Friends list not available yet.";
        return;
    }

    const currentIds = Object.keys(current);
    status.lastCheck = Date.now();
    if (currentIds.length === 0) {
        status.note = "Friends list is empty (offline or still loading).";
        return;
    }

    const storeKey = FRIENDS_KEY_PREFIX + me;
    const known = load(storeKey, null);
    if (!known) {
        save(storeKey, current);
        status.tracking = currentIds.length;
        status.note = "Saved your friends list. Watching for changes.";
        log("baseline saved:", currentIds.length, "friends");
        return;
    }

    const knownIds = Object.keys(known);
    const missing = knownIds.filter((id) => !current[id]);
    if (missing.length > MASS_DROP_MIN && missing.length > knownIds.length / 2) {
        status.note = "Friends list did not fully load, skipped this check.";
        return;
    }

    const next = { ...known };
    updatePresentFriends(known, current, next);
    const needsRecheck = await handleMissingFriends(known, missing, next);

    save(storeKey, next);
    if (needsRecheck) setTimeout(poll, RECHECK_MS);
    status.tracking = Object.keys(next).length;
    status.note = "Watching for changes.";
}

function updatePresentFriends(known, current, next) {
    for (const id of Object.keys(current)) {
        missingCount.delete(id);
        const was = known[id];
        const now = current[id];

        if (!was) {
            next[id] = now;
            notify("added", id, now);
            continue;
        }

        if (was.name && now.name && was.name !== now.name) {
            if (pendingNames.get(id) === now.name) {
                pendingNames.delete(id);
                next[id] = now;
                notify("renamed", id, now, was.name);
            } else {
                pendingNames.set(id, now.name);
            }
            continue;
        }

        pendingNames.delete(id);
        next[id] = { name: now.name || was.name, avatar: now.avatar || was.avatar };
    }
}

async function handleMissingFriends(known, missing, next) {
    let needsRecheck = false;

    for (const id of missing) {
        const misses = (missingCount.get(id) || 0) + 1;
        if (misses < 2) {
            missingCount.set(id, misses);
            needsRecheck = true;
            continue;
        }

        missingCount.delete(id);
        delete next[id];

        const selfAction = takeSelfAction(id);
        if (selfAction) {
            notify(selfAction === "blocked" ? "selfBlocked" : "selfUnfriended", id, known[id]);
            continue;
        }

        const profile = await lookupProfile(id);
        notify(profile === "deleted" ? "deleted" : "removed", id, known[id]);
    }

    return needsRecheck;
}

async function lookupProfile(steamid) {
    try {
        return await checkProfile({ steamid });
    } catch (err) {
        warn("check_profile failed", err);
        return "unknown";
    }
}
