# Jellyfin Segment Editor

Manage Jellyfin Media Segment positions the simple way. This tool is in early stages of development.

* Create/Edit/Delete all kind of Segments (Intro, Outro, ...)
* Player to copy timestamps while you watch

## Requirements

* Jellyfin Server with Media Segments API
* Jellyfin Server API Key (created by you)

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
