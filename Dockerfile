#Node js install
#project setup
#package install
#build
#run


#use offical node.js LTS as the base image 

FROM node:22-alpine

#set the working directory in the container
WORKDIR /app

#copy package.json and package-lock.json tp the working directory 

COPY package*.json ./

#install project dependencies
RUN npm install

#copy the rest of the application code to the working directory
COPY . .

#build the application
RUN npm run build

#expose the application port
EXPOSE 3000

#start the application
CMD ["node", "dist/main.js"]

