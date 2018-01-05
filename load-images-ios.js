var iOSImages = require('./lib/ios-images.js');
var ProjectItems = require('./lib/xamarin-project-items.js');

var src = new iOSImages();
src.loadFromPath('/Users/Tom/Downloads/耳机/UI_重新切图');
console.log(`load ${src.imageCount} images, ${src.fileCount} files`);
src.saveToProject('/Users/Tom/Desktop/Projects/EarPhone/EarPhone/iOS');
var project = new ProjectItems('/Users/Tom/Desktop/Projects/EarPhone/EarPhone/iOS');
for (var folder of src.newFolders)
    project.addFileItem(folder, 'Folder');
for (var file of src.newFiles)
    project.addFileItem(file, 'ImageAsset');
project.saveToProject();