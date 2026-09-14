const TOAST_CSS = `
#${TOAST_STACK_ID}{position:fixed;right:16px;bottom:16px;z-index:2147483647;display:flex;flex-direction:column;gap:8px;pointer-events:none}
.jn-toast{pointer-events:auto;display:flex;gap:10px;align-items:center;width:320px;padding:10px 12px;border-radius:6px;background:linear-gradient(135deg,#2a2f3a,#1b1f27);color:#dcdedf;box-shadow:0 8px 24px rgba(0,0,0,.5);border-left:4px solid var(--jn-accent,#6c7480);font-family:"Motiva Sans",Arial,sans-serif;cursor:pointer;animation:jn-in .25s ease-out;transition:opacity .25s,transform .25s}
.jn-toast-img{width:40px;height:40px;border-radius:4px;flex:none;object-fit:cover;background:#1b1f27;display:flex;align-items:center;justify-content:center;color:#8b929a}
.jn-toast-img svg{width:20px;height:20px}
.jn-title{font-size:13px;font-weight:600;color:#fff}
.jn-body{font-size:12px;opacity:.75;margin-top:2px}
.jn-out{opacity:0;transform:translateX(24px)}
@keyframes jn-in{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:none}}
`;

const TRAY_CSS = `
.jn-tray{display:flex;flex-direction:column;gap:4px;margin:2px 0 6px;font-family:"Motiva Sans",Arial,sans-serif}
.jn-tray-head{display:flex;justify-content:space-between;align-items:center;padding:4px 0 2px 2px;font-size:11px;font-weight:600;color:#8b929a;text-transform:uppercase;letter-spacing:.06em}
.jn-tray-clear{background:transparent;border:none;border-radius:3px;color:#8b929a;font-size:12px;font-weight:600;padding:3px 8px;cursor:pointer;font-family:inherit;text-transform:none;letter-spacing:0;transition:background .15s,color .15s}
.jn-tray-clear:hover{background:rgba(255,255,255,.1);color:#fff}
.jn-tray-item{position:relative;display:flex;gap:10px;align-items:center;padding:var(--jn-pad,10px);border-radius:var(--jn-radius,4px);background:var(--jn-bg,rgba(255,255,255,.06));cursor:pointer;text-align:left;transition:filter .15s}
.jn-tray-item:hover{filter:brightness(1.2)}
.jn-tray-img{width:44px;height:44px;border-radius:3px;flex:none;object-fit:cover;background:#1b1f27;display:flex;align-items:center;justify-content:center;color:#8b929a}
.jn-tray-img svg{width:22px;height:22px}
.jn-tray-bar{align-self:stretch;width:2px;border-radius:1px;flex:none;background:var(--jn-accent);opacity:.8}
.jn-tray-text{min-width:0;flex:1;padding-right:14px}
.jn-tray-meta{display:flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:#8b929a;white-space:nowrap}
.jn-tray-meta svg{width:13px;height:13px;flex:none;color:var(--jn-accent)}
.jn-tray-time{font-weight:400;margin-left:3px}
.jn-tray-title{font-size:14px;font-weight:600;color:#fff;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.jn-tray-body{font-size:12px;color:#8b929a;margin-top:1px}
.jn-tray-dot{position:absolute;top:12px;right:10px;width:7px;height:7px;border-radius:50%;background:#59bf40}
`;

function ensureStyles(doc) {
    if (doc.getElementById(STYLE_ID)) return;
    const style = doc.createElement("style");
    style.id = STYLE_ID;
    style.textContent = TOAST_CSS + TRAY_CSS;
    doc.head.appendChild(style);
}
