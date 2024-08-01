FROM node:18

WORKDIR /usr/src

COPY . .

RUN yarn