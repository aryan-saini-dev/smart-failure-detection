FROM ubuntu:22.04

# Prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install Node.js 20 and Python 3
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    python3-pip \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
# using --break-system-packages because Ubuntu 22.04 enforces PEP 668, but we are in an isolated container
RUN pip3 install --no-cache-dir -r requirements.txt --break-system-packages

# Install Node.js dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Set environment variable for Node to find Python inside Docker
ENV PYTHON_PATH=python3

# Expose API port
EXPOSE 8787

# Start the Node.js API server
CMD ["npm", "run", "api"]
