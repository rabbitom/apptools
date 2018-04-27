/*
 * sync from ios to droid
 */
var iOSImages = require('./lib/ios-images.js');
var AndroidImages = require('./lib/android-images.js');
var ProjectItems = require('./lib/xamarin-project-items.js');

var imagesPath = '/Users/ziv/Downloads/temp';
var xamarinSolutionPath = '/Users/ziv/Desktop/EarPhone';

var src = new iOSImages();
src.loadFromPath(imagesPath);

src.saveToProject(xamarinSolutionPath + '/iOS');
var iosProject = new ProjectItems(xamarinSolutionPath + '/iOS');
for (var folder of src.newFolders)
    iosProject.addFileItem(folder, 'Folder');
for (var file of src.newFiles)
    iosProject.addFileItem(file, 'ImageAsset');
iosProject.saveToProject();

var dest = new AndroidImages();
dest.images = src.images;
dest.saveToProject(xamarinSolutionPath + '/Droid');
console.log(`${dest.imageCount} images, ${dest.fileCount} files saved.`);

var droidProject = new ProjectItems(xamarinSolutionPath + '/Droid');
for (var file of dest.newFiles)
    droidProject.addFileItem(file, 'AndroidResource');
droidProject.saveToProject();