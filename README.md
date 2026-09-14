# RelationshipNotifier

Millennium plugin for Steam that lets you know when someone unfriends you.

It also picks up new friends, name changes and deleted accounts, and keeps a log when you unfriend or block someone yourself. Alerts show up as a popup in the corner, in the Steam notification bell, and as a Steam desktop popup that still shows when Steam is minimized.

Steam doesn't tell you when you get blocked, so a block just shows up as an unfriend.

## Install

1. Install [Millennium](https://steambrew.app)
2. Grab the zip from [Releases](../../releases)
3. Extract it to `Steam/millennium/plugins/` (you should end up with `plugins/RelationshipNotifier/plugin.json`)
4. Restart Steam and turn it on under Millennium > Plugins

The first time it runs it just saves your friends list, so you'll only get alerts for changes after that.

F4 sends a test notification.

Settings are under Millennium > RelationshipNotifier. You can turn each alert on or off, pick which ones also get the desktop popup, change their colors, and look through the history. Everything is on by default.

## Building

Needs Node.

```
npm run build     # builds .millennium/Dist/index.js
npm run release   # builds and zips into release/
npm run deploy    # builds and copies into your Steam folder (Windows)
```
