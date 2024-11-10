# VANGUARD url with port dynamically
export VANGUARD_URL=http://localhost:$VANGAURD_PORT
# Bastion url with port dynamically
export BASTION_URL=http://localhost:$BASTION_PORT

npx checkly test --record