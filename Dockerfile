FROM node:10
ENV NODE_ENV=development NODE_PATH=/usr/src/app
ENV PORT=3001
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
EXPOSE 3001
# Bundle app source
COPY . .
CMD ["npm","run dev"]