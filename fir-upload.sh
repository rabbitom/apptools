#!/bin/sh

if [ $# != 2 ]; then
    echo "Upload apk/ipa file to fir.im."
    echo "Usage: $0 <filepath> <message>"
    exit 1
fi

## turbo upload speed
#sh -c "$(curl -sSL https://gist.githubusercontent.com/trawor/5dda140dee86836b8e60/raw/turbo-qiniu.sh)"

fir p $1 -T $FIR_TOKEN -c "$2"
