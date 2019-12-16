/**
 * 
 */
const HTMLAsset = require('parcel-bundler/src/assets/HTMLAsset');

class HtmlAsset extends HTMLAsset {
  constructor(name, options) {
    super(name, options);
  }
  async parseIfNeeded() {
    await this.loadIfNeeded();
    // replace references to "dist" with "app" on the fly
    var code = this.contents
      .replace('dist/main.js', 'app/main.ts')
      .replace('dist/main.css', 'app/main.css')
      .replace('dist/resources/', '/resources/');
    if (!this.ast) {
      this.ast = await this.parse(code);
    }
  }
}

module.exports = HtmlAsset;