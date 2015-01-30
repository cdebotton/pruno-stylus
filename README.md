# pruno-stylus

A Stylus mix for pruno that includes font-awesome, normalize.css, nib, jeet, and rupture.

## Usage

```js
"use strict";

var pruno = require('pruno');

pruno.plugins(function(mix) {
  mix
    .configure({ dir: __dirname + '/config' })
    .stylus({
      'entry': '::src/stylus/index.styl',
      'dist': '::dist/stylesheets/app.css',
      'search': '::src/**/*.styl',
      'minify': false,
      'source-maps':true,
      'font-awesome': false,
      'normalize': false,
      'use': ['nib', 'jeet', 'rupture']
    });
});
```
