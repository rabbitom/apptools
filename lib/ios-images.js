const fs = require('fs');
const path = require('path');

function iOSImages() {
    this.images = {};
    this.fileCount = 0; //文件数量
    this.imageCount = 0; //图片数量（多个分辨率的算一张图片）
}

iOSImages.prototype.loadFromPath = function(srcPath) {
    const iOSImageResPattern = /(^.*)@([2|3]x).png/;
    var files = fs.readdirSync(srcPath);
    for (var file of files) {
        var filePath = path.join(srcPath, file);
        var fileName = path.basename(file);
        var parts = fileName.match(iOSImageResPattern);
        if (parts == null)
            continue;
        this.fileCount++;
        var imageName = parts[1];
        var res = parts[2];
        var image = this.images[imageName];
        if (image)
            image[res] = filePath;
        else {
            image = {};
            image[res] = filePath;
            this.images[imageName] = image;
            this.imageCount++;
        }
    }
}

iOSImages.prototype.saveToProject = function(destPath) {
    var basePath = path.basename(destPath);
    var assetPath;
    if (basePath.endsWith('.xcassets'))
        assetPath = destPath;
    else {
        assetPath = path.join(destPath, 'Assets.xcassets');
        if (!fs.existsSync(assetPath)) {
            assetPath = path.join(destPath, 'Images.xcassets');
            if (!fs.existsSync(assetPath))
                throw new Error('No Assets.xcassets or Images.xcassets folder found is dest path.');
        }
    }
    for (var imageName in this.images) {
        var imageDir = path.join(assetPath, imageName + '.imageset');
        var contents;
        if (!fs.existsSync(imageDir))
            fs.mkdirSync(imageDir); //添加文件夹
        var contentsFilePath = path.join(imageDir, "Contents.json");
        var contents;
        if (fs.existsSync(contentsFilePath))
            contents = JSON.parse(fs.readFileSync(contentsFilePath).toString());
        else
            contents = { //添加文件
                "images": [],
                "info": {
                    "version": 1,
                    "author": "xcode"
                }
            };
        var contentsUpdated = false;
        var image = this.images[imageName];
        for (var res in image) {
            var resExists = false;
            for (var imageContent of contents.images) {
                if (imageContent.scale == res) {
                    resExists = true;
                    break;
                }
            }
            if (resExists)
                continue;
            var destFileName = `${imageName}@${res}.png`;
            var destFilePath = path.join(imageDir, destFileName);
            var imagePath = image[res];
            fs.copyFileSync(imagePath, destFilePath); //添加文件
            var imageContent = {
                "filename": destFileName,
                "scale": res,
                "idiom": "universal"
            }
            contents.images.push(imageContent);
            contentsUpdated = true;
        }
        if (contentsUpdated)
            fs.writeFileSync(contentsFilePath, JSON.stringify(contents));
    }
}

module.exports = iOSImages;