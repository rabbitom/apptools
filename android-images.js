const fs = require('fs');
const path = require('path');

function AndroidImages() {
    this.images = {};
    this.ignore = ['.DS_Store'];
}

AndroidImages.prototype.loadDrawables = function(srcPath) {
    const android_res = {
        'drawable-xhdpi': '2x',
        'drawable-xxhdpi': '3x'
    }
    var basePath = path.basename(srcPath);
    var res = android_res[basePath];
    if (res == null)
        return;
    var files = fs.readdirSync(srcPath);
    for (var filename of files) {
        if (this.ignore.indexOf(filename) >= 0)
            continue;
        var filepath = path.join(srcPath, filename);
        var basename = path.basename(filename, '.png');
        var image = this.images[basename];
        if (image)
            image[res] = filepath;
        else {
            image = {};
            image[res] = filepath;
            this.images[basename] = image;
        }
    }
}

AndroidImages.prototype.loadResources = function(srcPath) {
    var dirs = fs.readdirSync(srcPath);
    for (var dir of dirs)
        this.loadDrawables(path.join(srcPath, dir));
}

AndroidImages.prototype.loadFromPath = function(srcPath) {
    var basePath = path.basename(srcPath);
    if (basePath == 'Resources')
        this.loadResources(srcPath);
    else {
        var resPath = path.join(srcPath, 'Resources');
        if (fs.existsSync(resPath))
            this.loadResources(resPath);
        else
            this.loadDrawables(srcPath);
    }
}

module.exports = AndroidImages;