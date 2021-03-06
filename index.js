"use strict";

var path = require('path');
var streamqueue = require('streamqueue');
var plugins = require('gulp-load-plugins')();

function StylusTask(params) {
  this.params = (params || {});
}

StylusTask.getDefaults = function() {
  return {
    'entry': '::src/stylus/index.styl',
    'dist': '::dist/stylesheets/app.css',
    'search': '::src/**/*.styl',
    'minify': false,
    'source-maps':true,
    'concat': [
      './node_modules/normalize.css/normalize.css',
      './node_modules/font-awesome/css/font-awesome.css'
    ],
    'use': ['nib', 'jeet', 'rupture']
  };
};

StylusTask.prototype.enqueue = function(gulp, params) {
  params = (params || {});
  var opts = distillOptions(StylusTask, params);

  if (params['source-maps']) {
    opts.sourcemap = {
      inline: true,
      sourceRoot: '.'
    }
  }

  if (params.use && getType(params.use) === 'array') {
    opts.use = params.use.map(function(m) {
      return require(m)()
    });
  }

  return compileCSS({
    gulp: gulp,
    compiler: 'stylus',
    opts: opts,
    params: params
  });
};

StylusTask.prototype.generateWatcher = function() {
  return true;
};

function compileCSS(args) {
  var gulp = args.gulp;
  var compiler = args.compiler;
  var opts = args.opts;
  var params = args.params;
  var parts = params.dist.match(/^(.+\/)(.+\.css)$/);
  var dist = parts[0];
  var distDir = parts[1];
  var fileName = parts[2];
  var stream = streamqueue({objectMode: true});

  stream.pipe(
    plugins.if(
      params['source-maps'],
      plugins.sourcemaps.init({loadMaps: true})
    )
  );

  if (params.concat) {
    var type = Object.prototype.toString.call(params.concat)
      .match(/^\[object (.+)\]$/)[1]
      .toLowerCase();

    switch (type) {
      case 'array':
        params.concat.forEach(function(file) {
          stream.queue(gulp.src(file));
        });
        break;
      case 'string':
        stream.queue(gulp.src(params.concat));
        break;
      default:
        throw new Error('Invalid concat.');
        break;
    }
  }

  stream.queue(
    gulp.src(params.entry)
      .pipe(plugins.plumber())
      .pipe(plugins[compiler](opts))
  );

  return stream.done()
    .pipe(plugins.concat(fileName))
    .pipe(plugins.if(params.minify, plugins.minifyCss()))
    .pipe(plugins.if(params['source-maps'], plugins.sourcemaps.write()))
    .pipe(gulp.dest(distDir));
}

function pkg(pkgName, path) {
  return './node_modules/pruno-stylus/node_modules/' + pkgName + '/' + path;
};

function getType(obj) {
  return Object.prototype.toString.call(obj)
    .match(/^\[object (.+)\]$/i)[1]
    .toLowerCase();
}

function distillOptions(Task, params) {
  var defaults = Object.keys(Task.getDefaults())
    .concat(['taskName']);

  return Object.keys(params)
    .filter(function (param) {
      return defaults.indexOf(param) === -1;
    })
    .reduce(function (memo, param) {
      memo[param] = params[param];
      delete params[param];
      return memo;
    }, {});
}

module.exports = StylusTask;
