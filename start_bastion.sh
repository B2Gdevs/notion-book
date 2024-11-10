#!/bin/bash

# Source the .env.local file for Bastion
if [ -f "apps/bastion/.env.local" ]; then
  # Export variables from .env.local
  export $(grep -v '^#' apps/bastion/.env.local | xargs)

  # Unset any public Next.js variables
  while IFS= read -r line; do
    if [[ $line == NEXT_PUBLIC_* ]]; then
      var_name=$(echo "$line" | cut -d '=' -f 1)
      unset "$var_name"
    fi
  done < apps/bastion/.env.local

fi

# Define colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Define the port
export BASTION_PORT=4201 # replace with your port

# Kill any processes running on the port
echo -e "${GREEN}Killing any processes running on port $BASTION_PORT...${NC}"
kill $(lsof -t -i:$BASTION_PORT) > /dev/null 2>&1

# Run the command in the background and pipe its output to tee
turbo run dev --filter={apps/bastion} | tee output.log &

# Get the PID of the background process
pid=$!

# Wait for the localhost URL to be available in the output
echo -e "${GREEN}Waiting for localhost URL...${NC}"
localhost_url="http://localhost:$BASTION_PORT"
while ! grep -q "$localhost_url" output.log; do
  sleep 1
done

# Display the menu
echo -e "${GREEN}----------------------------------${NC}"
echo -e "${GREEN}Bastion is running at:${NC} ${RED}$localhost_url${NC}"
echo -e "${GREEN}----------------------------------${NC}"

# Export the localhost URL as an environment variable
export LOCALHOST_URL=$localhost_url

# Wait for the background process to finish
wait $pid