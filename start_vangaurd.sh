#!/bin/bash

if [ -f "apps/vangaurd/.env.local" ]; then
  # Export variables from .env.local
  export $(grep -v '^#' apps/vangaurd/.env.local | xargs)

  # Unset any public Next.js variables
  while IFS= read -r line; do
    if [[ $line == NEXT_PUBLIC_* ]]; then
      var_name=$(echo "$line" | cut -d '=' -f 1)
      unset "$var_name"
    fi
  done < apps/vangaurd/.env.local

fi

export VANGAURD_PORT=4200 # replace with your port

# Define colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Kill any processes running on the port
echo -e "${GREEN}Killing any processes running on port $VANGAURD_PORT...${NC}"
kill $(lsof -t -i:$VANGAURD_PORT) > /dev/null 2>&1

# Run the command in the background and pipe its output to tee
turbo run dev --filter={apps/vangaurd} | tee output.log &

# Get the PID of the background process
pid=$!

# Wait for the localhost URL to be available in the output
echo -e "${GREEN}Waiting for localhost URL...${NC}"
while ! grep -o 'http://localhost:[0-9]*' output.log > /dev/null; do
  sleep 1
done

# Extract the localhost URL
localhost_url=$(grep -o 'http://localhost:[0-9]*' output.log)

# Display the menu
echo -e "${GREEN}----------------------------------${NC}"
echo -e "${GREEN}Vangaurd is running at:${NC} ${RED}$localhost_url${NC}"
echo -e "${GREEN}----------------------------------${NC}"

# Export the localhost URL as an environment variable
export LOCALHOST_URL=$localhost_url

# Wait for the background process to finish
wait $pid

