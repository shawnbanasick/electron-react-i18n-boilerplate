# Electron-React-i18n Template

## Features

- allows on-demand lanugage change of menu items and UI
- stores window size / location for next start
- stores lanugage choice for next start
- confirms exit

## Installation

- npm install
- npm run postinstall
- npm run build (to set up translation files)

## Updating - Caution

updating electron-settings beyond 3.2.0 breaks i18n setup (1/12/2021)

## Development

npm run electron-dev

## Adding new translation entries

- add new entries to public/locales/
- npm run build
- npm run electron-dev

## Distribution

npm run build

- npm run dist:macOS
- npm run dist:windows
- npm run dist:linux

## i18n Libraries

- i18next
- react-18next
