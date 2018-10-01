const path = require('path')
const fs = require('fs')

module.exports.makeResourcePath = function(srcPath) {
    var basePath = path.basename(srcPath);
    if (basePath == 'Resources')
        return srcPath;
    else {
        var resPath = path.join(srcPath, 'Resources');
        if (fs.existsSync(resPath))
            return resPath;
    }
}