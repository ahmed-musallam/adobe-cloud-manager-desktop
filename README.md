# Adobe Cloud Manager Desktop
A desktop application for managing your Adobe Cloud Manager instances.


<p align="center">
  <br>
  <img src="doc/cloud-manager.gif">
  <br>
</p>

## Download Binaries
[Download latest from releases section](https://github.com/ahmed-musallam/adobe-cloud-manager-desktop/releases)

## Usage
You'll need to create an API integration in Adobe IO consolefor this client to connect to your Cloud Manager instance. See the [adobe docs](https://www.adobe.io/apis/experiencecloud/cloud-manager/docs.html#!AdobeDocs/cloudmanager-api-docs/master/create-api-integration.md) for details on creating an API integration.

Once you have created an API integration, you can add a new account in Cloud Manager Desktop and fill the `API Key`, `Client Secret`, `Organization ID`, `Technical Account` and `Private Key`.

_detailed documentation coming soon_

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
1. [Cloud Manager API](https://www.adobe.io/apis/experiencecloud/cloud-manager/api-reference.html)
1. Coral Spectrun
  this is the web components implementation of Adobe's spectrum CSS
  - [Coral Spectrum on github](https://github.com/adobe/coral-spectrum)
  - [Coral Spectrum Components demo](https://opensource.adobe.com/coral-spectrum/dist/examples)
  - [Coral Spectrum References](https://opensource.adobe.com/coral-spectrum/dist/documentation/identifiers.html)

2. Electron Menubar
  The library used to builf this app as a menubar app [github](https://github.com/maxogden/menubar)
