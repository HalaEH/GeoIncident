FROM node:18-alpine

WORKDIR /app

# Copy package files first
#COPY package*.json ./
COPY frontend/package*.json ./
# Install dependencies
RUN npm install

# Copy the rest of the frontend code
#COPY . .
COPY frontend/ ./



# Expose Vite's default port
EXPOSE 5173

# Use CMD instead of RUN for the dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]