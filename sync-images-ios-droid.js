/*
 * sync from ios to droid
 */
var iOSImages = require('./lib/ios-images.js');
var AndroidImages = require('./lib/android-images.js');
var ProjectItems = require('./lib/xamarin-project-items.js');

var src = new iOSImages();
src.loadFromPath('/Users/Tom/Downloads/耳机/UI_重新切图/_buttons');

var dest = new AndroidImages();
dest.images = src.images;
dest.saveToProject('/Users/Tom/Desktop/Projects/EarPhone/EarPhone/Droid');
console.log(`${dest.imageCount} images, ${dest.fileCount} files saved.`);

var project = new ProjectItems('/Users/Tom/Desktop/Projects/EarPhone/EarPhone/Droid');
for (var file of dest.newFiles)
    project.addFileItem(file, 'AndroidResource');
project.saveToProject();