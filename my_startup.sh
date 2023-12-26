#!/bin/sh

source /home/frolov/Software/root_v6.28.06/build/bin/thisroot.sh
source /home/frolov/Software/Geant4/geant4-v11.0.0-install/bin/geant4.sh

#
export GARFIELD_HOME=/home/frolov/Software/GarfieldPP_2022/install
export HEED_DATABASE=$GARFIELD_HOME/share/Heed/database

export ELMER_HOME=/home/frolov/Software/Elmer/install
#export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$ELMER_HOME/lib
#LD_LIBRARY_PATH cannot be set in etc/profile.d/
#see Ubuntu_readme.txt
export PATH=$PATH:$ELMER_HOME/bin:/home/frolov/.local/bin

touch /home/frolov/Documents/profile.d.test
echo "PATH=$PATH" > /home/frolov/Documents/profile.d.test

alias python="python3"

