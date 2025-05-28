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
# NEXT_PUBLIC_ variables available at build time would be embedded here.
# Since we want runtime, this build will not embed NEXT_PUBLIC_BACKEND_URL
# unless it's already set in the CI/build environment for some other reason.
RUN bun run build

# Production stage
FROM oven/bun:1.1-alpine

WORKDIR /app

# Copy package.json to install production dependencies
COPY package*.json ./

# Set environment variables
ENV NODE_ENV=production
# This declares the environment variable. Kubernetes will provide its actual value at runtime.
# An empty value here is fine as it will be overridden.
ENV NEXT_PUBLIC_GRAPHQL_URI=

# Install production dependencies (Bun automatically skips devDependencies)
RUN bun install 

# Copy built assets from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the default Next.js port
EXPOSE 3000

# Command to run the application
# 'bun start' (which typically runs 'next start') will pick up runtime environment variables.
CMD ["bun", "start"]