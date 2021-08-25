FROM balenalib/raspberry-pi2-node
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 5000
ENV HOST=0.0.0.0
CMD ["npm", "start"]