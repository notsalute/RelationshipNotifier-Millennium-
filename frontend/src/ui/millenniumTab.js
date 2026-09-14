const MILLENNIUM_TAB_TITLE = "RelationshipNotifier";
const MILLENNIUM_PLUGINS_ROUTE = "/millennium/settings/plugins";
const MILLENNIUM_TAB_ROUTE = "/millennium/settings/relationshipnotifier";

const isMillenniumSettings = (props) =>
    String(props?.className || "").includes("MillenniumSettings") || props?.title === "Millennium";

function millenniumTabIcon() {
    return h("svg", {
        viewBox: "0 0 24 24",
        fill: "currentColor",
        width: 20,
        height: 20,
        dangerouslySetInnerHTML: { __html: ICONS.bell },
    });
}

function withRelationshipNotifierPage(props) {
    const pages = props?.pages;
    if (!isMillenniumSettings(props) || !Array.isArray(pages)) return props;
    if (pages.some((page) => page?.title === MILLENNIUM_TAB_TITLE)) return props;

    const Body = M.DialogBody || "div";
    const page = {
        visible: true,
        title: MILLENNIUM_TAB_TITLE,
        icon: millenniumTabIcon(),
        content: h(Body, { className: M.Classes?.SettingsDialogBodyFade }, h(SettingsPanel, null)),
        route: MILLENNIUM_TAB_ROUTE,
    };

    const plugins = pages.findIndex((item) => item?.route === MILLENNIUM_PLUGINS_ROUTE);
    const at = plugins >= 0 ? plugins + 1 : pages.length;
    return { ...props, pages: [...pages.slice(0, at), page, ...pages.slice(at)] };
}

function installMillenniumTab() {
    const original = M.SidebarNavigation;
    if (!original) {
        warn("Millennium SidebarNavigation not found; settings tab not added");
        return false;
    }
    if (original.__relationshipNotifierWrapped) return true;

    const wrapped = (props) => h(original, withRelationshipNotifierPage(props));
    wrapped.__relationshipNotifierWrapped = true;

    try {
        M.SidebarNavigation = wrapped;
    } catch {}
    if (M.SidebarNavigation !== wrapped) {
        try {
            Object.defineProperty(M, "SidebarNavigation", { value: wrapped, writable: true, configurable: true });
        } catch {}
    }

    if (M.SidebarNavigation !== wrapped) {
        warn("could not add tab to Millennium settings");
        return false;
    }
    log("added tab to Millennium settings");
    return true;
}
