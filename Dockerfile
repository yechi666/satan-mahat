FROM node:lts AS builder

ARG VUE_APP_REDIRECT_URL
ARG VUE_APP_OCEAN_WS
ARG VUE_APP_OCEAN_HTTP
ARG VUE_APP_TENANT_ID
ARG VUE_APP_CLIENT_ID

ARG LOGGER_URL
ARG OUTLOOK_DOMAIN
ARG OUTLOOK_SERVICE_PASSWORD
ARG OUTLOOK_SERVICE_URL
ARG OUTLOOK_SERVICE_USERNAME

# npm behind proxy
# RUN npm config set proxy http://10.0.0.10:80
# RUN npm config set https-proxy http://10.0.0.10:80

# set the directory we want to run the next commands for
WORKDIR /tmp/satan-client

# copy npm files first for efficient build and caching
COPY ./frontend/package*.json ./

# clean all dependencies and install them. clean unused cache
RUN npm ci && npm cache clean --force

# copy our source code into the container
COPY ./frontend .

ENV VUE_APP_REDIRECT_URL=${VUE_APP_REDIRECT_URL}
ENV VUE_APP_OCEAN_WS=${VUE_APP_OCEAN_WS}
ENV VUE_APP_OCEAN_HTTP=${VUE_APP_OCEAN_HTTP}
ENV VUE_APP_TENANT_ID=${VUE_APP_TENANT_ID}
ENV VUE_APP_CLIENT_ID=${VUE_APP_CLIENT_ID}

# build the application for production or exit with error code if fails
RUN npm run build || exit 1

# create the container for running the server
FROM node:lts

ARG LOGGER_URL
ARG OUTLOOK_DOMAIN
ARG OUTLOOK_SERVICE_PASSWORD
ARG OUTLOOK_SERVICE_URL
ARG OUTLOOK_SERVICE_USERNAME

# RUN npm config set proxy http://10.0.0.10:80
# RUN npm config set https-proxy http://10.0.0.10:80

RUN npm i -g typescript ts-node

WORKDIR /usr/src/server

COPY ./backend/package*.json ./

ENV LOGGER_URL=${LOGGER_URL}
ENV OUTLOOK_DOMAIN=${OUTLOOK_DOMAIN}
ENV OUTLOOK_SERVICE_PASSWORD=${OUTLOOK_SERVICE_PASSWORD}
ENV OUTLOOK_SERVICE_URL=${OUTLOOK_SERVICE_URL}
ENV OUTLOOK_SERVICE_USERNAME=${OUTLOOK_SERVICE_USERNAME}

RUN npm ci && npm cache clean --force

COPY ./backend .

# copy the built client to our served directory
COPY --from=builder /tmp/satan-client/dist ./public

EXPOSE 3000

CMD [ "ts-node", "./index.ts" ]