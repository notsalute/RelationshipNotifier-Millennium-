exports.default = plugin;
Object.defineProperty(exports, "__esModule", { value: true });
return exports;
})({}, window.MILLENNIUM_API);
};

async function ExecutePluginModule(){let e=PluginEntryPointMain();Object.assign(window.PLUGIN_LIST[pluginName],{...e,__millennium_internal_plugin_name_do_not_use_or_change__:pluginName});let n=await e.default();var a;n&&((a=n)&&void 0!==a.title&&void 0!==a.icon&&void 0!==a.content)&&(window.MILLENNIUM_SIDEBAR_NAVIGATION_PANELS[pluginName]=n),MILLENNIUM_BACKEND_IPC.postMessage(1,{pluginName:pluginName})}ExecutePluginModule();
