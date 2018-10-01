const IOSLogo = require('./lib/ios-logo.js')
const AndroidLogo = require('./lib/android-logo.js')
const xamarin = require('./lib/xamarin-lib.js')

let logoFilePath = '/Users/Tom/Downloads/icon.png'
let solutionPath = '/Users/Tom/Projects/EarPhone/Mu6'

let iOSProjectPath = xamarin.makeIOSProjectPath(solutionPath)
if(iOSProjectPath === undefined)
    throw new Error("iOS project not found")
let iOSLogo = new IOSLogo(iOSProjectPath)
if(iOSLogo.contents === undefined)
    throw new Error("iOS appIconSet not found")
iOSLogo.replaceAll(logoFilePath)

let androidProjectPath = xamarin.makeAndroidProjectPath(solutionPath)
if(androidProjectPath === undefined)
    throw new Error("Android project not found")
let androidLogo = new AndroidLogo(androidProjectPath)
if(androidLogo.resPath === undefined)
    throw new Error("android resource folder not found")
androidLogo.replaceAll(logoFilePath)