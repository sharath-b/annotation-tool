# Enterprise deployment procedure

## Deployment

The bafin deployment requires to prebuild the frontend and add the compiled UI into the package.
To build it follow these steps:

1. Open *.env* file and ensure that REACT_APP_API is set to /api (.env.example should be alright)
2. Build the project by npm run build
3. commit latest changes

   cp .env frontend
   cd frontend
   npm i
   npm run build

Now the deployment is ready. Push to git

   git add . -A
   git commit -m "updated release"


## Testing

Before zipping and sending the data to the client, test the following functionality:

1.  Deployment

The deploy the system on a fresh AWS EC2 instance following the DEPLOYMENT.MD process.

2. Login

3. Upload a document

4. Add a label



## Installation

 Installation for production use

To run the application in production we recommend a redhat based setup.
Our docker-compose file works only following the steps described below.



1. Install [S2I](https://github.com/openshift/source-to-image#Installation) app.

Example Mac:
```
$ brew install source-to-image
```


2. Login to `registry.redhat.io` with your credentials:
```
$ docker login registry.redhat.io
```

3. build nginx with certificats
- Replace `nginx-image/root/opt/app-root/certs/server.crt` and `root/opt/app-root/certs/private/server.key` with correct ones and build init image for proxy:
```
$  docker build -t nginx-proxy:init nginx-image
```

- Build proxy image with `S2I`:
```
$ s2i build https://github.com/sclorg/nginx-container.git --context-dir=1.14/test/test-app/ nginx-proxy:init nginx-proxy:latest
```

4. Copy `.env.example` file to `.env` and fill in proper variables.

5. Launch docker-compose stack

```
mkdir postgres-data
sudo chmod 0777 postgres-data
$ docker-compose up -d --build
```


Now the application should be available on port 80 and 443. Use docker ps or docker logs to debug issues.


```
$ docker ps
```

## Difference in deployment

### Images

Please open dockerfile and docker-compose.

dockerfile:


  FROM registry.access.redhat.com/ubi8/nodejs-10

  instead of FROM node:lts

docker-compose.yml:


 Postgres image is registry.redhat.io/rhel8/postgresql-12 # some clients prefer redhat, so you can choose
  (instead of "postgres:10")

If we need an nginx proxy, then you need also to adjust the nginx setup in the docker compose file.
Full example is availble in this directory as docker-compose.enterprise.yml
