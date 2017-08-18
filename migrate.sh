#!/usr/bin/env bash
git pull
#create a copy of datasources.json called datasources1.json
cp server/datasources.json server/datasources1.json
#copy datasources.production.json to datasources.json
cp server/datasources.production.json server/datasources.json
#migrate the database
lb-migration migrate --ds=mysql --method=update
#recreate original datasources.json
mv server/datasources1.json server/datasources.json
forever restart server/server.js
exit 1