# Jellyfin Segment Editor

Manage Jellyfin Media Segment positions the simple way. This tool is in early stages of development.

* Create/Edit/Delete all kind of Segments (Intro, Outro, ...)
* Player to copy timestamps while you watch

## Requirements

* Jellyfin Server with Media Segments API
* Jellyfin Server API Key (created by you)

## Installation

Just as docker compose file available

```yaml
# Testing Jellyfin Media Segments
# DO NOT MESS WITH YOUR STABLE SETUP! Use clean config directory
# For amd64 only, no arm64 build available

version: "3.0"
services:
### Jellyfin server with media segments api (be aware that the jellyfin web player is NOT patched at this point - you need jellyfin-vue)
  jellyfin:
    image: ghcr.io/endrl/jellyfin:latest
    container_name: jellyfin-ms
    volumes:
      - /path/to/library:/config
      - /path/to/cache:/cache
      # media libraries
      - /path/to/tvseries:/data/tvshows
      - /path/to/movies:/data/movies
    ports:
      - 7096:8096
      #- 8920:8920 #optional
      #- 7359:7359/udp #optional
      #- 1900:1900/udp #optional
    restart: unless-stopped
### Patched jellyfin-vue as player to see media segments in action.
### Also available as tiny app for your desktop
### Project: https://github.com/endrl/jellyfin-vue
  jellyfin-vue:
    image: ghcr.io/endrl/jellyfin-vue:latest
    container_name: jellyfin-vue
    ports:
      - 7097:80
    restart: unless-stopped
### Jellyfin Segment Editor - Media Segments management made easy
### Also available as tiny app for your desktop
### Project: https://github.com/endrl/segment-editor#jellyfin-segment-editor
  jellyfin-se:
    image: ghcr.io/endrl/jellyfin-se:latest
    container_name: jellyfin-se
    ports:
      - 7098:80
    restart: unless-stopped
```


## Related projects

* Jellyfin Plugin: [Media Analyzer](https://github.com/endrl/jellyfin-plugin-media-analyzer)
* Jellyfin Plugin: [.EDL Creator](https://github.com/endrl/jellyfin-plugin-edl)
* Player: [Jellyfin Vue Fork](https://github.com/endrl/jellyfin-vue)

## Work in progress

* Fix: Movie collections
* [X] Movies should open in player view
* Server side search query
* Add audio support
* More filter

## Pictures

![Overview](docs/editor-overview.png)
![TV Shows](docs/editor-tvshow.png)
![Player](docs/player-editor.png)

## Development setup

Install node LTS, clone this repo and run

```bash
npm i && npm i -g @quasar/cli
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

## Tauri App building
Install [Rust](https://www.rust-lang.org/learn/get-started)

### Tauri dev

```bash
npm run tauri dev
```

### Tauri build for production

```bash
npm run tauri build
```
