# Jellyfin Segment Editor

Manage Jellyfin Media Segment positions the simple way. This tool is in early stages of development.

* Create/Edit/Delete all kind of Segments (Intro, Outro, ...)
* Player to copy timestamps while you watch

## Requirements

* Jellyfin Server with Media Segments API
* Jellyfin Server API Key (created by you)

## Work in progress

* Fix: Movie collections
* Movies should open in player view
* Manage all media segments by creatorId (new page)
* Add "pagination" when fetching items
* Server side search query
* Add audio support
* More filter

## Pictures

![Overview](docs/editor-overview.png)
![TV Shows](docs/editor-tvshow.png)
![Player](docs/player-editor.png)

## Development setup

Install node LTS, clone this repo and run

```
# npm
npm install
```

### Compiles and hot-reloads for development

```
# npm
npm run dev
```

### Compiles and minifies for production

```
# npm
npm run build
```

### Lints and fixes files

```
# npm
npm run lint
```
