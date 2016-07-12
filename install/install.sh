#!/bin/bash

#password sets | note to self : change the password, but for the time being keep them here.
#root - coreroot
#persona - corepersona

#preparing automated networking setup
hostame cr1.localdomain.local


#preparing rethinkdb for install
echo "deb http://download.rethinkdb.com/apt `lsb_release -cs` main" | sudo tee /etc/apt/sources.list.d/rethinkdb.list
wget -qO- https://download.rethinkdb.com/apt/pubkey.gpg | sudo apt-key add -

sudo apt-get update

sudo apt-get install rethinkdb

wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash

nvm install 5.0

echo "TESTING NVM FOR INSTALLATION"
command -v mvm

echo "Installing rethinkdb node driver"
npm install rethinkdbdash
