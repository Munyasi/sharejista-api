#!/usr/bin/env bash
#create a copy of datasources.json called datasources1.json
cp server/datasources.json server/datasources1.json
#copy datasources.production.json to datasources.json
cp cp server/datasources.production.json server/datasources.json
#migrate the database
lb-migration migrate --ds=mysql --method=update
#recreate original datasources.json
cp server/datasources1.json server/datasources.json
#exit
exit 1