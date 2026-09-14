local logger = require("logger")
local http   = require("http")

local profile = {}

local PROFILE_URL = "https://steamcommunity.com/profiles/%s/?xml=1"
local NOT_FOUND   = "The specified profile could not be found"
local USER_AGENT  = "RelationshipNotifier-Millennium-Plugin/1.0"

function profile.check(steamid)
    steamid = tostring(steamid)

    local ok, res = pcall(http.get, string.format(PROFILE_URL, steamid), {
        timeout = 10,
        follow_redirects = true,
        headers = { ["User-Agent"] = USER_AGENT },
    })

    if not ok or not res or res.status ~= 200 then
        logger:error("profile check failed for " .. steamid .. ": " .. tostring(ok and (res and res.status) or res))
        return "unknown"
    end

    local body = res.body or ""
    if body:find(NOT_FOUND, 1, true) then
        return "deleted"
    end

    return body:match("<privacyState>(.-)</privacyState>") or "unknown"
end

return profile
