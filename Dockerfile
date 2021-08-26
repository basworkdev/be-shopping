FROM node:10
ENV NODE_ENV=development NODE_PATH=/usr/src/app
ENV PORT=8080
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
EXPOSE 8080
# Bundle app source
COPY . .
CMD ["npm","start"]