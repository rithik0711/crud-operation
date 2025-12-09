# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of backend code
COPY . .

# Expose port and start app
EXPOSE 8080
CMD ["npm", "start"]
