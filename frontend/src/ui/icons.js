const ICONS = {
    minus: '<path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-7 1.7-7 4.5V20h14v-2.5C16 14.7 12.3 13 9 13Zm7-3h7v2h-7z"/>',
    plus: '<path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-7 1.7-7 4.5V20h14v-2.5C16 14.7 12.3 13 9 13Zm9-6h2v3h3v2h-3v3h-2v-3h-3v-2h3z"/>',
    block: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 0 1 4.9 1.7L5.7 16.9A8 8 0 0 1 12 4Zm0 16a8 8 0 0 1-4.9-1.7L18.3 7.1A8 8 0 0 1 12 20Z"/>',
    pencil: '<path d="M3 17.3V21h3.7l11-11-3.7-3.7-11 11ZM20.7 7a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.7 3.7L20.7 7Z"/>',
    bell: '<path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm6-6v-5a6 6 0 0 0-5-5.9V4a1 1 0 0 0-2 0v1.1A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2Z"/>',
};

function svgIcon(doc, kind) {
    const holder = doc.createElement("div");
    holder.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor">' + ICONS[kindInfo(kind).icon] + "</svg>";
    return holder.firstChild;
}
