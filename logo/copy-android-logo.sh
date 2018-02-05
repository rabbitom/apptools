#!/bin/sh
if [ $# != 1 ]; then
    echo "Copy android logo images to other projects."
    echo "Usage: $0 android-resources-path"
    echo "android-resources-path: where drawable- folders exist, without suffix /"
    exit 1
fi
reslist=(hdpi xhdpi xxhdpi)
for res in ${reslist[@]};do
    cp mipmap-$res/icon.png $1/drawable-$res/
done
