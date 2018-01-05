/*
 * compare image list
 */
var iOSImages = require('./lib/ios-images.js');
var AndroidImages = require('./lib/android-images.js');

function unionImageList(title_a, list_a, title_b, list_b) {
    console.log(`${title_a}: ${list_a.imageCount} images`);
    console.log(`${title_b}: ${list_b.imageCount} images`);

    var union = [];
    var a_left = [];
    var b_left = [];
    for (var image in list_a.images) {
        if (list_b.images[image])
            union.push(image);
        else
            a_left.push(image);
    }
    for (var image in list_b.images) {
        if (list_a.images[image] == null)
            b_left.push(image);
    }
    console.log(`union: ${union.length} images`);

    function showArray(title, arr) {
        console.log(title + ': ' + arr.length);
        for (var item of arr)
            console.log(item);
    }

    if (a_left.length > 0)
        showArray('left in ' + title_a, a_left);
    if (b_left.length > 0)
        showArray('left in ' + title_b, b_left);

    return union;
}

var droid = new AndroidImages();
droid.ignore.push('icon.png');
droid.loadFromPath('/Users/Tom/Desktop/Projects/EarPhone/EarPhone/Droid/Resources/drawable-xhdpi');

var qietu = new iOSImages();
qietu.loadFromPath('/Users/Tom/Downloads/耳机/UI_重新切图');

var union = unionImageList('Droid', droid, 'Qietu', qietu);

//compare images size
var sizeOf = require('image-size');
var sameCount = 0;
for (var imageName of union) {
    var imageDroid = droid.images[imageName];
    var imageQietu = qietu.images[imageName];
    for (var res in imageDroid) {
        var imageDroidPath = imageDroid[res];
        var imageQietuPath = imageQietu[res];
        if ((imageDroidPath == null) || (imageQietuPath == null))
            continue;
        var imageDroidDimension = sizeOf(imageDroidPath);
        var imageQietuDimension = sizeOf(imageQietuPath);
        if ((imageDroidDimension.width == imageQietuDimension.width) && (imageDroidDimension.height == imageQietuDimension.height))
            sameCount++;
        else
        //console.log(`${imageName}: droid - ${imageDroidDimension.width}x${imageDroidDimension.height}, qietu - ${imageQietuDimension.width}x${imageQietuDimension.height}`);
            console.log(`size difference of ${imageName} @${res}: ${imageQietuDimension.width - imageDroidDimension.width} x ${imageQietuDimension.height - imageDroidDimension.height}`);
    }
}
console.log(`${sameCount} images with same size`);