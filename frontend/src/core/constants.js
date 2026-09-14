const TAG = "[RelationshipNotifier]";

const POLL_MS = 15000;
const RECHECK_MS = 3000;
const STARTUP_DELAY_MS = 5000;
const WINDOW_SCAN_MS = 2000;
const TOAST_MS = 10000;
const TRAY_RENDER_DELAY_MS = 250;

const TRAY_LIMIT = 5;
const HISTORY_LIMIT = 200;
const MASS_DROP_MIN = 5;

const STEAMID64_BASE = 76561197960265728n;
const HISTORY_KEY = "RelationshipNotifier:history";
const SETTINGS_KEY = "RelationshipNotifier:settings";
const FRIENDS_KEY_PREFIX = "RelationshipNotifier:friends:";
const STYLE_ID = "relationship-notifier-style";
const TOAST_STACK_ID = "relationship-notifier-stack";

const React = window.SP_REACT;
const h = React.createElement;
const checkProfile = __wrapped_callable__("check_profile");

const log = (...args) => console.log(TAG, ...args);
const warn = (...args) => console.warn(TAG, ...args);
