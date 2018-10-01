const android = require('./android-lib.js')
const exec = require('child_process').exec
const path = require('path')

const iconSize = {
    'mdpi': 48,
    'hdpi': 72,
    'xhdpi': 96,
    'xxhdpi': 144,
    'xxxhdpi': 192
}

function AndroidLogo(projectPath) {
    this.resPath = android.makeResourcePath(projectPath)
}

AndroidLogo.prototype.replaceAll = function(logoFilePath) {
    for(let res in iconSize) {
        let imageSize = iconSize[res]
        let filePath = path.join(this.resPath, 'mipmap-' + res, 'Icon.png')
        let command = `convert -resize ${imageSize}x${imageSize} ${logoFilePath} ${filePath}`
        exec(command, error => {
            if(error)
                exit(1, error)
            else
                console.log(`android mipmap-${res} logo replaced!`)
        });
    }
}

module.exports = AndroidLogo