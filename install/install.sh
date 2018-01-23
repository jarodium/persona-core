#!/bin/bash

#password sets | note to self : change the password, but for the time being keep them here.
#root - coreroot
#persona - corepersona

sudo apt-get update

#preparing automated networking setup
hostame cr1.localdomain.local #does not work in debian... hell why? must see docs

#installing dependencies
apt-get install git-core libpcsclite1 libpcsclite-dev pcscd

#installing node
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash
  #always install stable
nvm install stable

echo "TESTING NVM FOR INSTALLATION"
command -v mvm

#install pcsd tools
apt-get install

############## NODE ENVIRONMENT SETUP #############
  ##Setup npm installation to be used without root or sudo rights.
mkdir ~/.node
echo "prefix = ~/.node" >> ~/.npmrc
echo "PATH=\"\$HOME/.node/bin:\$PATH\"" >> ~/.profile
echo "NODE_PATH=\"\$HOME/.node/lib/node_modules:\$NODE_PATH\"" >> ~/.profile
echo "MANPATH=\"\$HOME/.node/share/man:\$MANPATH\"" >> ~/.profile
source ~/.profile
###################################################


npm install -g pcsclite
