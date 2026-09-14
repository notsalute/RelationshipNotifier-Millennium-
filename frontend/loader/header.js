const MILLENNIUM_IS_CLIENT_MODULE=!0,pluginName="RelationshipNotifier";function InitializePlugins(){var e;(e=window.PLUGIN_LIST||(window.PLUGIN_LIST={}))[pluginName]||(e[pluginName]={}),window.MILLENNIUM_SIDEBAR_NAVIGATION_PANELS||(window.MILLENNIUM_SIDEBAR_NAVIGATION_PANELS={})}InitializePlugins();const __call_server_method__=(e,n)=>Millennium.callServerMethod(pluginName,e,n);function __wrapped_callable__(e){return e.startsWith("webkit:")?MILLENNIUM_API.callable((e,n)=>MILLENNIUM_API.__INTERNAL_CALL_WEBKIT_METHOD__(pluginName,e,n),e.replace(/^webkit:/,"")):MILLENNIUM_API.callable(__call_server_method__,e)}

let PluginEntryPointMain = function () {
return (function (exports, M) {
"use strict";
