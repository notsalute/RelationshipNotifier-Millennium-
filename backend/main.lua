local logger     = require("logger")
local millennium = require("millennium")
local profile    = require("profile")

function check_profile(steamid)
    return profile.check(steamid)
end

local function on_load()
    logger:info("RelationshipNotifier backend loaded")
    millennium.ready()
end

local function on_frontend_loaded()
    logger:info("RelationshipNotifier frontend loaded")
end

local function on_unload() end

return {
    on_load = on_load,
    on_frontend_loaded = on_frontend_loaded,
    on_unload = on_unload,
}
