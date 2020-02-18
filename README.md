# Adobe Cloud Manager Desktop
A simple menubar app to show cloud manger status.


## Build From Source

```
# runs electron build and generates a DMG packaged application
npx gulp electron:dmg
```

## Development

Building and running the electron app:

```
# Show all available gulp tasks
npx gulp --tasks
```

```
# runs the electron app and watches for changes
npx gulp electron:watch:debug
```
### Helpful links for development

1. Coral Spectrun
  this is the web components implementation of Adobe's spectrum CSS
  - [Coral Spectrum on github](https://github.com/adobe/coral-spectrum)
  - [Coral Spectrum Components demo](https://opensource.adobe.com/coral-spectrum/dist/examples)
  - [Coral Spectrum References](https://opensource.adobe.com/coral-spectrum/dist/documentation/identifiers.html)

2. Electron Menubar
  The library used to builf this app as a menubar app [github](https://github.com/maxogden/menubar)
