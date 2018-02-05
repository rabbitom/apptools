#!/usr/bin/env node
var fs = require('fs');
var exec = require('child_process').exec;

var argc = process.argv.length;
if(argc < 4) {
	exit(0, 'create ios app logos with ImageMagick convert command. \nusage: create-ios-logo.js logo-file.png ios-project-dir [options]\nios-project-dir: where AppIcon.appiconset is\noptions:\n\t-i idiom: select idiom(iphone, ipad, ...)\n\t-o: overwrite image file if already exists\n\t-r: only replace image files that already exist');
}
var logoFile = process.argv[2];
var destDir = process.argv[3] + '/AppIcon.appiconset';
var idiom = null;
var overwrite = false;
var replace = false;
for(a=4; a<argc; a++) {
	var key = process.argv[a];
	var value = null;
	if(a+1 < argc) {
		value = process.argv[a+1];
		if(value.indexOf('-') != 0)
			value = null;
		else
			a++;
	}
	if(key == '-i')
		idiom = value;
	else if(key == '-o')
		overwrite = true;
    else if(key == '-r') {
        overwrite = true;
        replace = true;
    }
}

fs.access(logoFile, fs.constants.R_OK, (err) => {
	if(err) {
		exit(1, `cannot access logo file ${logoFile}`);
	}
});
fs.access(destDir, fs.constants.R_OK, (err) => {
	if(err) {
		exit(1, `cannot access dest dir ${destDir}`);
	}
});

var contentsPath = destDir + '/Contents.json';
fs.readFile(contentsPath, {encoding: "utf8", flag: "r"}, (err, data) => {
	if(err)
		exit(1, `no Contents.json found in dir ${destDir}`);
	else {
		var contents = JSON.parse(data);
		var images = new Array();
		for(var image of contents.images) {
			if((idiom != null) && (idiom != image.idiom))
				continue;
            if(replace && (image.filename == null))
                continue;
			createImage(image, (newImage)=>{
				images.push(newImage);
				if(images.length == contents.images.length) {
					contents.images = images;
					fs.writeFile(contentsPath, JSON.stringify(contents), (err) => {
						if(err)
							exit(1, err);
						else
							exit(0, contents);
					});
				}
			});
		}
	}	
});

function createImage(image, callback) {
	var size = parseInt(image.size);
	var scale = parseInt(image.scale);
	var scaledSize = size * scale;
	var fileName = `logo-${scaledSize}.png`;
	var filePath = destDir + '/' + fileName;
	fs.access(filePath, (err) => {
		if((err != null) || overwrite) {
			var command = `convert -resize ${scaledSize}x${scaledSize} ${logoFile} ${filePath}`;
			exec(command, (error, stdout, stdin) => {
				if(error)
					exit(1, error);
				else
					console.log(`${fileName} created!`);
			});
		}
		else
			console.log('found file:', filePath);
		image.filename = fileName;
		callback(image);
	});
}

function exit(code, msg) {
	if(code == 0)
		console.log(msg);
	else if(msg)
		console.log('error:', msg);
	process.exit(code);
}

