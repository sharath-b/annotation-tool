#!/usr/bin/env bash

git pull

read_var() {
    VAR=$(grep $1 $2 | xargs)
    IFS="=" read -ra VAR <<< "$VAR"
    echo ${VAR[1]}
}

ENV=$(read_var ENV .env)
echo $ENV
npm i

./node_modules/sequelize-cli/lib/sequelize db:migrate --env $ENV

export EGG_SERVER_ENV=production
npm stop
npm start
#pm2 stop app.js || true
#pm2 start app.js

