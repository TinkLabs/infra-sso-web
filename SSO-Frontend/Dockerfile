FROM node:10

COPY ./ /app
WORKDIR /app
RUN npm install
RUN npm run start:next

EXPOSE 4000

CMD ["npm", "run", "start:server"]