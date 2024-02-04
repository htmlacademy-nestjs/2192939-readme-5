FROM node:20.10-alpine
WORKDIR /opt/readme-user
COPY ./dist/apps/user/package.json .
RUN npm install --omit=dev
COPY ./dist/apps/user .
CMD ["node","main.js"]
