const fs = require('fs');
const path = require('path');

function ProjectItems() {
    this.items = [];
}

ProjectItems.prototype.addFileItem = function(filePath) {
    var relativePath = path.relative('iOS/', filePath);
    var item = `<ImageAsset Include="${relativePath}" />`;
    this.items.push(item);
}

ProjectItems.prototype.saveItems = function(destProjectDir) {
    var destProjectFile = null;
    var destProjectFiles = fs.readdirSync(destProjectDir);
    for (var filename of destProjectFiles) {
        if (/\.csproj$/.test(filename)) {
            destProjectFile = filename;
            break;
        }
    }
    if (destProjectFile) {
        var destProjectFilePath = path.join(destProjectDir, destProjectFile);
        var buf = fs.readFileSync(destProjectFilePath);
        var str = buf.toString();
        var index = str.lastIndexOf('</ItemGroup>');
        index += '</ItemGroup>'.length;
        var fd = fs.openSync(destProjectFilePath, 'w');
        var prefix = str.substr(0, index);
        var suffix = str.substr(index);
        fs.writeSync(fd, prefix);
        var itemGroup = '\n  <ItemGroup>\n    ' + this.items.join('\n    ') + '\n  </ItemGroup>';
        fs.writeSync(fd, itemGroup);
        fs.writeSync(fd, suffix);
        fs.closeSync(fd);
        console.log(str);
    }
}

module.exports = ProjectItems;