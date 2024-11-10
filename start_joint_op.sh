#!/bin/bash

# Define colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Define the port
export JOINT_OP_PORT=4202 # replace with your port

# Kill any processes running on the port
echo -e "${GREEN}Killing any processes running on port $JOINT_OP_PORT...${NC}"
kill $(lsof -t -i:$JOINT_OP_PORT) > /dev/null 2>&1

# Run the command in the background and pipe its output to tee
turbo run dev --filter={apps/joint_op} | tee output.log &

# Get the PID of the background process
pid=$!

# Wait for the localhost URL to be available in the output
echo -e "${GREEN}Waiting for localhost URL...${NC}"
localhost_url="http://localhost:$JOINT_OP_PORT"
while ! grep -q "$localhost_url" output.log; do
  sleep 1
done

# Display the menu
echo -e "${GREEN}----------------------------------${NC}"
echo -e "${GREEN}Joint op is running at:${NC} ${RED}$localhost_url${NC}"
echo -e "${GREEN}----------------------------------${NC}"

# Export the localhost URL as an environment variable
export LOCALHOST_URL=$localhost_url

# Wait for the background process to finish
wait $pid

# Kill the process running on the port
echo -e "${GREEN}Killing the process running on port $JOINT_OP_PORT...${NC}"
kill $(lsof -t -i:$JOINT_OP_PORT) > /dev/null 2>&1