#!/usr/bin/env bash

rsync -avi --delete --exclude=.DS_Store --exclude=.git --exclude=.idea /Users/francois/dev/projects/Hedra-web-editor/dist/ kimsufi2:/home/applications/Hedra-editor/
