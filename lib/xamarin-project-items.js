const fs = require('fs');
const path = require('path');

function ProjectItems(projectPath) {
    this.projectPath = projectPath;
    this.items = {};
}

ProjectItems.prototype.addFileItem = function(filePath, itemType) {
    var relativePath = path.relative(this.projectPath, filePath);
    if (itemType == 'Folder') {
        if (!relativePath.endsWith('\\'))
            relativePath = relativePath + '\\';
    }
    var item = `<${itemType} Include="${relativePath}" />`;
    var itemList = this.items[itemType];
    if (itemList)
        itemList.push(item);
    else
        this.items[itemType] = [item];
}

ProjectItems.prototype.saveToProject = function() {
    var projectFile = null;
    var projectFiles = fs.readdirSync(this.projectPath);
    for (var filename of projectFiles) {
        if (/\.csproj$/.test(filename)) {
            projectFile = filename;
            break;
        }
    }
    if (projectFile == null)
        return;
    var projectFilePath = path.join(this.projectPath, projectFile);
    var str = fs.readFileSync(projectFilePath).toString();
    var strChanged = false;
    for (var itemType in this.items) {
        var itemList = this.items[itemType];
        var index = -1;
        var lastItemIndex = str.lastIndexOf('<' + itemType + ' ');
        if (lastItemIndex == -1) //之前没有此种ItemType，添加到最后一个ItemGroup之后
            index = str.lastIndexOf('</ItemGroup>') + '</ItemGroup>'.length;
        else //之前已经有此种ItemType，添加到最后一个Item之后
            index = str.indexOf('\n  </ItemGroup>', lastItemIndex);
        var prefix = str.substr(0, index);
        var suffix = str.substr(index);
        var itemLines = '\n    ' + itemList.join('\n    ');
        if (lastItemIndex == -1) //新建ItemGroup
            str = prefix + '\n  <ItemGroup> ' + itemLines + '\n  </ItemGroup>' + suffix;
        else //仅添加新Item行
            str = prefix + itemLines + suffix;
        strChanged = true;
    }
    fs.writeFileSync(projectFilePath, str);
}

module.exports = ProjectItems;