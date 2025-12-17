# This is my node version
FROM node:22.21.1-bullseye 

WORKDIR /app

# Copy package files
COPY package*.json ./

# Will run all dependecies
RUN npm install

# Copy from source to destination
COPY . .

# Specifiy which port our app is running on 
EXPOSE 5000

CMD ["npm","run", "start"]