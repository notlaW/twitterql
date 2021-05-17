const { src } = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');

function lint() {
  return src(['src/**/*.js', 'test/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.failAfterError());
}

function test() {
  return src(['test/**/*.spec.js']).pipe(mocha({ timeout: 3000 }));
}

exports.lint = lint;
exports.test = test;
