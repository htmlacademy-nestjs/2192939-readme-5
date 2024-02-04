FROM node:20.10.0-slim
RUN apt-get update && apt-get install -y openssl libssl-dev

WORKDIR /opt/readme-public
COPY ./dist/apps/publication/package.json .
RUN npm install --omit=dev

COPY ./libs/shared/publication/models/prisma/schema.prisma ./schema.prisma

RUN npx prisma generate --schema schema.prisma
RUN cp -R ../../node_modules/.prisma ./node_modules && rm -rf ../node_modules

COPY ./dist/apps/publication .

CMD [ "node","./main.js" ]
