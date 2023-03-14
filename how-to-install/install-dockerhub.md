# Installation from dockerhub

1. Open docker-compose and update the following variables:

Credentials should match in database image and application configuration.

    DEFAULT_ADMIN_EMAIL: "example@example.com"
    DEFAULT_ADMIN_PASSWORD: "DEMO_PASSWORD"

    PROD_DB_NAME: "databasename"
    PROD_DB_USERNAME: "somesafeuser"
    PROD_DB_PASSWORD: "somesafepassword"


    POSTGRES_USER: "somesafeuser"
    POSTGRES_PASSWORD: "somesafepassword"
    POSTGRES_DB: "databasename"

2. Copy default docker-compose file + Dockerfile

  cp docker-compose.default.yml docker-compose.yml
  cp Dockerfile.default Dockerfile

3. Run docker compose

  docker-compose up


4. now the service should be available on the following port:

localhost:7001


## Setup SSL

you might want to use nginx for SSL or as a general proxy. If you want to do so, please check docker-compose.nginx.yml and create a corresponding nginx configuration file.





