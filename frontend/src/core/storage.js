function load(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function save(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
        warn("save failed", err);
    }
}

const listeners = new Set();
const status = { tracking: 0, lastCheck: null, note: "Waiting for friends list" };
let history = load(HISTORY_KEY, []);

const entryKey = (item) => item.time + ":" + item.steamid + ":" + item.kind;

function emit() {
    listeners.forEach((listener) => listener());
}

function record(entry) {
    history = [{ ...entry, time: Date.now(), read: false }, ...history].slice(0, HISTORY_LIMIT);
    save(HISTORY_KEY, history);
    emit();
}

function markAllRead() {
    if (!history.some((item) => !item.read)) return;
    history = history.map((item) => ({ ...item, read: true }));
    save(HISTORY_KEY, history);
}

function clearHistory() {
    history = [];
    save(HISTORY_KEY, history);
    emit();
}
