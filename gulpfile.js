const { src, dest, parallel } = require('gulp');
const svgSprite   = require('gulp-svg-sprite');
const watch       = require('gulp-watch');
const sass        = require('gulp-sass');
const sourcemaps  = require('gulp-sourcemaps');
const minify 			= require('gulp-minify');
const babel 			= require('gulp-babel');
const plumber 		= require('gulp-plumber');

const basePath = './includes/';

const paths = {
	sass 	    : basePath + 'style/',
  js        : basePath + 'script/',
  img       : basePath + 'img/',
  build     : basePath + 'build/'
};

function compileSass () {
	return src(paths.sass + 'style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(dest(paths.build));
}

function sprite () {
	return src(paths.img + '*.svg')
	.pipe(svgSprite({
		shape: {
			spacing: {
				padding: 5
			}
		},
		mode: {
			css: {
				dest: './',
				sprite: paths.build + 'flags.svg',
				bust: false,
				render: {
					scss: {
						dest: paths.sass + '_spritesheet.scss',
						template: paths.sass + '_sprite-template.scss'
					}
				}
			}
		},
		variables: {
			mapname: "icons"
		}
	}))
	.pipe(dest('./'));
}

function minifyJS() {
	return src(paths.js + 'pretty-select.js')
		.pipe(plumber())
    // Transpile the JS code using Babel's preset-env.
    .pipe(babel({
      presets: [
        ['@babel/env', {
          modules: false
        }]
      ]
    }))
    .pipe(minify({ noSource: true }))
    .pipe(dest(paths.build))
}

function watchSprite() {
  return sprite()
    .pipe(watch(basePath + '/img/flags/*', sprite));
}

function watchSass() {
  return compileSass()
    .pipe(watch(paths.sass + '**/*.scss', compileSass));
}

function watchJS() {
  return minifyJS()
    .pipe(watch(paths.js + 'pretty-select.js', minifyJS));
}

exports.sass          = compileSass;
exports.watchSass     = watchSass;
exports.sprite        = sprite;
exports.watchSprite   = watchSprite;
exports.js						= minifyJS;
exports.watch         = parallel(watchSprite, watchSass, watchJS);
exports.default       = parallel(sprite, compileSass, minifyJS);
