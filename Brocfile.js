var pickFiles = require('broccoli-static-compiler');
var compileModules = require('broccoli-babel-transpiler');
var mergeTrees = require('broccoli-merge-trees');

var libTreeES6 = pickFiles('lib', {
  srcDir: '/',
  files: ['**/*.js'],
  destDir: '/htmlbars-printer'
});

var testsTreeES6 = pickFiles('tests', {
  srcDir: '/',
  files: ['**/*.js'],
  destDir: '/tests'
});

var treesUMD = compileModules(mergeTrees([libTreeES6, testsTreeES6]), {
  modules: 'commonStrict',
  moduleIds: true
});

module.exports = treesUMD;
