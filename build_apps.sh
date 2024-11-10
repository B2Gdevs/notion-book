# This script runs the build_vangaurd.sh and build_bastion.sh scripts.

# We do this because the build scripts can be ran from one command, 
# but we control more explicitly what is being built.

# Run the build_vanguard.sh script
# echo "Running build_vanguard.sh" redo with color
echo -e "Running build_vangaurd.sh"
./build_vangaurd.sh

# Run the build_bastion.sh script
# echo "Running build_bastion.sh"
echo -e "Running build_bastion.sh"
./build_bastion.sh

# echo with color out that we are done
echo -e "Done building apps"
