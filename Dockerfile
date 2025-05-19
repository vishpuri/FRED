FROM node:lts-alpine

# Create app directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and lock files
COPY package.json pnpm-lock.yaml* ./

# Install only production dependencies initially
RUN pnpm install --prod --ignore-scripts

# Copy source code
COPY . .

# Build the project
RUN pnpm run build

# Expose no ports, use stdio

# Default command to run the MCP server
CMD ["node", "build/index.js"]