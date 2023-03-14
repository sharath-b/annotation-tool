<<<<<<< HEAD:enterprise-deployment/Dockerfile
# Annotation Tool Dockerfile
# --------------------------
#
# Use nodejs based on UBI
# Dockerfile can be found here: https://catalog.redhat.com/software/containers/detail/5c839aa3d70cc51dd4c425d9?container-tabs=dockerfile
#
FROM registry.access.redhat.com/ubi8/nodejs-10

#
# Configuration files
# -------------------
#
=======
# Use nodejs lts as base image
FROM node:lts
>>>>>>> master:dockerfile

# Copy source code into container image
COPY . .

#
# Installing dependencies
# -----------------------
<<<<<<< HEAD:enterprise-deployment/Dockerfile
=======
#

WORKDIR /frontend
RUN npm install
RUN npm run build
>>>>>>> master:dockerfile


WORKDIR /backend
RUN npm install

#
# Expose API port to the outside
#
EXPOSE 7001

# Launch application
ENTRYPOINT [ "./entrypoint.sh" ]
