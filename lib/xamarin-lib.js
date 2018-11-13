const path = require('path')
const fs = require('fs')

module.exports.makeIOSProjectPath = function(solutionPath) {
    var projectPath = path.join(solutionPath, 'iOS')
    if(fs.existsSync(projectPath))
        return projectPath;
    projectPath = path.join(solutionPath, path.basename(solutionPath) + '.iOS')
    if(fs.existsSync(projectPath))
        return projectPath;
}

module.exports.makeAndroidProjectPath = function(solutionPath) {
    var projectPath = path.join(solutionPath, 'Droid')
    if(fs.existsSync(projectPath))
        return projectPath;
    projectPath = path.join(solutionPath, path.basename(solutionPath) + '.Android')
    if(fs.existsSync(projectPath))
        return projectPath;
}