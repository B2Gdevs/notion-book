#!/bin/bash

CONFIG_FILE="config.yaml"
OUTPUT_FILE="/tmp/nextjs_output.txt"

# Kill any existing 'turbo run dev --filter={apps/vangaurd}' processes
echo "Killing existing 'turbo run dev --filter={apps/vangaurd}' processes..."
pkill -f 'turbo run dev --filter={apps/vangaurd}'

# Start the Next.js dev server and output to a file
echo "Starting the Next.js dev server..."
turbo run dev --filter={apps/vangaurd} > "$OUTPUT_FILE" 2>&1 &
DEV_SERVER_PID=$!

# Give some time for the server to start and print its output
echo "Waiting for the server to start..."
sleep 10  # Adjust this as needed to ensure the server has enough time to start

# Echo the contents of the output file
echo "Contents of the output file:"
cat "$OUTPUT_FILE"

# Extract the port from the output
echo "Checking for the server port..."
PORT=$(grep -o 'http://localhost:[0-9]*' "$OUTPUT_FILE" | head -1 | awk -F ':' '{print $3}')
if [ -z "$PORT" ]; then
    echo "Unable to find the server port in the output."
    exit 1
else
    echo "Development server started on port $PORT"
fi

# Extract ngrok_domain from config.yaml
NGROK_DOMAIN=$(awk -F": " '/ngrok_domain/{print $2}' "$CONFIG_FILE")

# Start ngrok with the extracted port
if [ -n "$NGROK_DOMAIN" ]; then
    echo "Starting ngrok with custom domain $NGROK_DOMAIN and port $PORT"
    ngrok http --domain="$NGROK_DOMAIN" "$PORT"
else
    ngrok http "$PORT"
fi

# Clean up on exit
trap "kill $DEV_SERVER_PID; exit" SIGINT SIGTERM
