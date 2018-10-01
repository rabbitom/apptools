const path = require('path');
const fs = require('fs');

module.exports.makeAssetPath = function(destPath) {
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
                    return null;
            }
        }
    }
    return assetPath;
}

module.exports.loadImageContents = function(imageDir) {
    var contentsFilePath = path.join(imageDir, "Contents.json");
    var contentsFileExists = fs.existsSync(contentsFilePath);
    if (contentsFileExists)
        return JSON.parse(fs.readFileSync(contentsFilePath).toString());
}