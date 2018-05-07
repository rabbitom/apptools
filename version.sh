#!/bin/sh
# change version code of Xamarin projects

if [ $# -lt 2 ]; then
	echo "usage: version.sh version_name version_code"
	exit 1
fi

pattern='s#\(.*versionName="\).*\(" package=.*versionCode="\).*\(">\)#\1'$1'\2'$2'\3#'
sed -i "" "$pattern" Droid/Properties/AndroidManifest.xml

pattern='/CFBundleShortVersionString/ {n;s#\(.*>\).*\(<.*\)#\1'$1'\2#;}'
sed -i "" "$pattern" iOS/Info.plist
pattern='/CFBundleVersion/ {n;s#\(.*>\).*\(<.*\)#\1'$2'\2#;}'
sed -i "" "$pattern" iOS/Info.plist

