FROM node:18-alpine

# Create app directory and set permissions
WORKDIR /app/backend

# Add non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app/backend

# Copy package files with correct ownership
COPY --chown=appuser:appgroup backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the application code with correct ownership
COPY --chown=appuser:appgroup backend/ .

# Expose the port the app runs on
EXPOSE 3000

# Switch to non-root user
USER appuser

# Command to run the app
CMD ["node", "server.js"] 