FROM node:16

RUN apt-get update && apt-get install -yq libgconf-2-4 locales
RUN localedef -f UTF-8 -i ko_KR ko_KR.UTF-8

ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Create ErrorLogs
# RUN mkdir -p app/logs/errors

# # Create InfoLogs
# RUN mkdir -p app/logs/infos

COPY . /app

# Install app dependencies

COPY package.json /app

COPY yarn.lock /app

RUN yarn install

# Bundle app source

RUN yarn build

EXPOSE 8000
CMD [ "yarn", "prod" ]
