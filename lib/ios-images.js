const fs = require('fs');
const path = require('path');

function iOSImages() {
    this.images = {};
    this.fileCount = 0; //文件数量
    this.imageCount = 0; //图片数量（多个分辨率的算一张图片）
    this.newFolders = [];
    this.newFiles = [];
    this.overwrite = true;
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
            if (!fs.existsSync(assetPath)) {
                assetPath = path.join(destPath, 'Resources', 'Images.xcassets');
                if (!fs.existsSync(assetPath))
                    throw new Error('No Assets.xcassets or Images.xcassets folder found is dest path.');
            }
        }
    }
    for (var imageName in this.images) {
        var imageDir = path.join(assetPath, imageName + '.imageset');
        var contents;
        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir); //添加文件夹
            this.newFolders.push(imageDir);
        }
        var contentsFilePath = path.join(imageDir, "Contents.json");
        var contentsFileExists = fs.existsSync(contentsFilePath);
        var contents;
        if (contentsFileExists)
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
            let imageContent;
            for (var resContent of contents.images) {
                if (resContent.scale == res) {
                    imageContent = resContent;
                    break;
                }
            }
            if((imageContent !== undefined) && (!this.overwrite))
                continue;
            var overwriteOriginalFile = false;
            var destFileName = `${imageName}@${res}.png`;
            if(imageContent !== undefined) {
                var imageFileName = imageContent.filename;
                if(imageFileName === destFileName)
                    overwriteOriginalFile = true;
                else {
                    if((imageFileName !== null) && (imageFileName !== '')) {
                        destFileName = imageFileName;
                        overwriteOriginalFile = true;
                    }
                    else {
                        imageContent.filename = destFileName;
                        contentsUpdated = true;
                    }
                }
            }
            var destFilePath = path.join(imageDir, destFileName);
            var imagePath = image[res];
            fs.copyFileSync(imagePath, destFilePath); //添加文件
            if(imageContent === undefined) {
                imageContent = {
                    "filename": destFileName,
                    "scale": res,
                    "idiom": "universal"
                }
                contents.images.push(imageContent);
                contentsUpdated = true;
            }
            if(!overwriteOriginalFile)
                this.newFiles.push(destFilePath);
        }
        if (contentsUpdated) {
            fs.writeFileSync(contentsFilePath, JSON.stringify(contents));
            if (!contentsFileExists)
                this.newFiles.push(contentsFilePath);
        }
    }
}

module.exports = iOSImages;