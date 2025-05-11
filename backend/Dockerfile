FROM node:18-alpine

WORKDIR /app

# Install nodemon globally for better development experience
RUN npm install -g nodemon

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app with nodemon for auto-reload
CMD ["nodemon", "--legacy-watch", "server.js"] 