/*
 * sync from ios to droid
 */
var iOSImages = require('./lib/ios-images.js');
var AndroidImages = require('./lib/android-images.js');

var src = new iOSImages();
src.loadFromPath('/Users/Tom/Downloads/耳机/UI_重新切图');

var dest = new AndroidImages();
dest.images = src.images;
dest.saveToProject('/Users/Tom/Desktop/Projects/EarPhone/EarPhone/Droid');
console.log(`${dest.imageCount} images, ${dest.fileCount} files saved.`);