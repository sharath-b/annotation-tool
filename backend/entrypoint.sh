#!/bin/bash
sleep 5
echo $PROD_DB_USERNAME
echo $PROD_DB_NAME
echo $PROD_DB_HOSTNAME
npm run migrate:up
npm start
