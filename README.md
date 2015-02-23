# pruno-stylus

A Stylus mix for pruno that includes font-awesome, normalize.css, nib, jeet, and rupture.

## Important change
Normalize and font-awesome have been removed from pruno-stylus. To include them, you must install them locally in your project and then add the following config to your setup. These were removed from this package to allow for you to
supply your own iconography library and CSS reset, or use none if that's what you want.

```yaml
stylus:
  concat:
    - ./node_modules/font-awesome/css/font-awesome.css
    - ./node_modules/normalize.css/normalize.css
```

```js
pruno
  .stylus({
    concat: [
      './node_modules/normalize.css/normalize.css',
      './node_modules/font-awesome/css/font-awesome.css'
    ]
  })
```

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
      concat: [
        './node_modules/normalize.css/normalize.css',
        './node_modules/font-awesome/css/font-awesome.css'
      ],
      'use': ['nib', 'jeet', 'rupture']
    });
});
```
