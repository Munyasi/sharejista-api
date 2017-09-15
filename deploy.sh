#!/usr/bin/env bash

# pull the latest changes from the remote repo
# requires a password
git pull

#checkout develop branch
# TODO: Change to master branch when all code is merged to master
git checkout develop

# install  node packages
npm install

#create a copy of datasources.json called datasources1.json
cp server/datasources.json server/datasources1.json

#copy datasources.production.json to datasources.json
cp server/datasources.production.json server/datasources.json

#migrate the database
lb-migration migrate --ds=mysql --method=update

#recreate original datasources.json
mv server/datasources1.json server/datasources.json

#set NODE_ENV to production
export NODE_ENV=production

# restart loopback server
forever restart -o info.log -e error.log server/server.js

#exit the script
exit 1