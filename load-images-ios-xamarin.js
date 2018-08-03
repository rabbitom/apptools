/*
 * sync from ios to droid
 */
var iOSImages = require('./lib/ios-images.js');
var AndroidImages = require('./lib/android-images.js');
var ProjectItems = require('./lib/xamarin-project-items.js');

var imagesPath = '/Users/Tom/Downloads/EarPhone';
var xamarinSolutionPath = '/Users/Tom/Desktop/Projects/EarPhone/EarPhone';

var src = new iOSImages();
src.loadFromPath(imagesPath);

src.saveToProject(xamarinSolutionPath + '/iOS');
if((src.newFiles.length > 0) || (src.newFolders.length > 0)) {
    var iosProject = new ProjectItems(xamarinSolutionPath + '/iOS');
    for (var folder of src.newFolders)
        iosProject.addFileItem(folder, 'Folder');
    for (var file of src.newFiles)
        iosProject.addFileItem(file, 'ImageAsset');
    iosProject.saveToProject();    
}

var dest = new AndroidImages();
dest.images = src.images;
dest.saveToProject(xamarinSolutionPath + '/Droid');
console.log(`${dest.imageCount} images, ${dest.fileCount} files saved.`);
if(dest.newFiles.length > 0) {
    var droidProject = new ProjectItems(xamarinSolutionPath + '/Droid');
    for (var file of dest.newFiles)
        droidProject.addFileItem(file, 'AndroidResource');
    droidProject.saveToProject();
}