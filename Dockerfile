FROM node:22

WORKDIR /usr/src

COPY . .

RUN yarn