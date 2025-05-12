FROM node:18-alpine

# Set working directory to backend
WORKDIR /app/backend

# Copy backend package files and install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy the backend application code
COPY backend/ .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["node", "server.js"] 