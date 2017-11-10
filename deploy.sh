#!/usr/bin/env bash
#start changes -- package-lock.json changes when npm install is run
git stash
# pull the latest changes from the remote repo
# requires a password
git pull

#checkout master branch
git checkout master

# install  node packages
npm install


#set NODE_ENV to production
export NODE_ENV=production

#create a copy of datasources.json called datasources1.json
cp server/datasources.json server/datasources1.json

#copy datasources.production.json to datasources.json
cp server/datasources.production.json server/datasources.json

#migrate the database
lb-migration migrate --ds=mysql --method=update

#recreate original datasources.json
mv server/datasources1.json server/datasources.json

# restart loopback server
forever restart -o info.log -e error.log server/server.js

#exit the script
exit 1