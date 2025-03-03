# Use official Bun image with Alpine Linux
FROM oven/bun:1.1-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and bun.lockb first for better cache utilization
COPY package*.json bun.lockb ./

# Install dependencies (Bun is much faster than npm/yarn)
RUN bun install

# Copy all source files
COPY . .

# Build the Next.js application
RUN bun run build

# Production stage
FROM oven/bun:1.1-alpine

WORKDIR /app

# Copy package.json to install production dependencies
COPY package*.json ./

# Set environment variables
ENV NODE_ENV=production

# Install production dependencies (Bun automatically skips devDependencies)
RUN bun install 

# Copy built assets from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the default Next.js port
EXPOSE 3000

# Command to run the application
CMD ["bun", "start"]