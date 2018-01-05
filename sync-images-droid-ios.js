/*
 * sync from droid to ios
 */
var iOSImages = require('./lib/ios-images.js');
var AndroidImages = require('./lib/android-images.js');

var basePath = '/Users/Tom/Desktop/Projects/EarPhone/EarPhone/';
var srcPath = basePath + 'Droid';
var destPath = basePath + 'iOS';

var src = new AndroidImages();
src.ignore.push('icon.png');
src.loadFromPath(srcPath);

console.log(JSON.stringify(src.images));

var dest = new iOSImages();
dest.images = src.images;
dest.saveToProject(destPath);