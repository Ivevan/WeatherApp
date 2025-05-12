FROM node:18-alpine

# Create app directory and set permissions
WORKDIR /app/backend

# Add non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app/

# Copy package files as root
COPY backend/package*.json ./

# Install dependencies
RUN npm install && \
    # Clean npm cache
    npm cache clean --force && \
    # Fix permissions
    chown -R appuser:appgroup /app/

# Copy application code
COPY backend/ .
RUN chown -R appuser:appgroup /app/

# Set user
USER appuser

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["node", "server.js"] 