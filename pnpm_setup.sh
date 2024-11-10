#!/bin/bash

# DEPRECATED: This should be moved in to our setup system where we install user shortcuts

# Create .bash_profile if it doesn't exist
if [ ! -f ~/.bash_profile ]; then
  touch ~/.bash_profile
fi

# Define start and end markers
start_marker="# START: PNPM Global Export"
end_marker="# END: PNPM Global Export"

# Remove the existing section if it exists
sed -i "/$start_marker/,/$end_marker/d" ~/.bash_profile

# Add the new section
echo "$start_marker" >> ~/.bash_profile
echo 'export PNPM_HOME="$HOME/.pnpm-global"' >> ~/.bash_profile
echo 'export PATH="$PNPM_HOME:$PATH"' >> ~/.bash_profile
echo "$end_marker" >> ~/.bash_profile