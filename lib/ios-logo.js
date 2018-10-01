const iOS = require('./ios-lib.js')
const path = require('path')
const exec = require('child_process').exec

function IOSLogo(projectPath) {
    var assetPath = iOS.makeAssetPath(projectPath);
    if(assetPath) {
        this.assetPath = assetPath;
        this.appIconPath = path.join(assetPath, "AppIcon.appiconset");
        this.contents = iOS.loadImageContents(this.appIconPath);    
    }
}

IOSLogo.prototype.replaceAll = function(logoFilePath) {
    for(let image of this.contents.images) {
        let filePath = path.join(this.appIconPath, image.filename)
        let scale = parseInt(image.scale)
        let size = parseFloat(image.size)
        let scaledSize = scale * size
        var command = `convert -resize ${scaledSize}x${scaledSize} ${logoFilePath} ${filePath}`
        exec(command, error => {
            if(error)
                exit(1, error)
            else
                console.log(`iOS ${size}@${scale}x logo replaced!`)
        });
    }
}

module.exports = IOSLogo;