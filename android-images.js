const fs = require('fs');
const path = require('path');

const android_folder_res = {
    'drawable-xhdpi': '2x',
    'drawable-xxhdpi': '3x'
}

function reverseObject(src) {
    var dest = {};
    for (var key in src) {
        var value = src[key];
        dest[value] = key;
    }
    return dest;
}

const android_res_folder = reverseObject(android_folder_res);

function AndroidImages() {
    this.images = {};
    this.ignore = ['.DS_Store'];
    this.fileCount = 0; //文件数量
    this.imageCount = 0; //图片数量（多个分辨率的算一张图片）
}

AndroidImages.prototype.loadDrawables = function(srcPath) {
    var basePath = path.basename(srcPath);
    var res = android_folder_res[basePath];
    if (res == null)
        return;
    var files = fs.readdirSync(srcPath);
    for (var filename of files) {
        if (this.ignore.indexOf(filename) >= 0)
            continue;
        this.fileCount++;
        var filepath = path.join(srcPath, filename);
        var basename = path.basename(filename, '.png');
        var image = this.images[basename];
        if (image)
            image[res] = filepath;
        else {
            image = {};
            image[res] = filepath;
            this.images[basename] = image;
            this.imageCount++;
        }
    }
}

AndroidImages.prototype.loadResources = function(srcPath) {
    var dirs = fs.readdirSync(srcPath);
    for (var dir of dirs)
        this.loadDrawables(path.join(srcPath, dir));
}

AndroidImages.prototype.getResPath = function(srcPath) {
    var basePath = path.basename(srcPath);
    if (basePath == 'Resources')
        return srcPath;
    else {
        var resPath = path.join(srcPath, 'Resources');
        if (fs.existsSync(resPath))
            return resPath;
    }
    return null;
}

AndroidImages.prototype.loadFromPath = function(srcPath) {
    var resPath = this.getResPath(srcPath);
    if (resPath)
        this.loadResources(resPath);
    else
        this.loadDrawables(srcPath);
}


AndroidImages.prototype.saveToProject = function(destPath) {
    var resPath = this.getResPath(destPath);
    if (resPath == null)
        return;
    for (var imageName in this.images) {
        var image = this.images[imageName];
        this.imageCount++;
        for (var res in image) {
            var folder = android_res_folder[res];
            if (folder == null)
                continue;
            var fileName = imageName + '.png';
            var srcFilePath = image[res];
            var destFilePath = path.join(resPath, folder, fileName);
            fs.copyFileSync(srcFilePath, destFilePath);
            this.fileCount++;
        }
    }
}

module.exports = AndroidImages;