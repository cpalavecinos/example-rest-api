FROM mhart/alpine-node:10
WORKDIR /app
ARG SERVICE_PORT=3000
ENV PORT $SERVICE_PORT
RUN echo $SERVICE_PORT
ARG SERVICE_NODE_ENV=development
ENV NODE_ENV $SERVICE_NODE_ENV
RUN echo $SERVICE_NODE_ENV
COPY package.json /app/
RUN npm install --production --no-optional --no-shrinkwrap --no-package-lock
COPY . /app
CMD node server.js
EXPOSE $SERVICE_PORT