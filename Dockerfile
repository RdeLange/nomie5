FROM arm32v7/node:10
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
ENV HOST=0.0.0.0
CMD ["npm", "start"]