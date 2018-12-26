#!/bin/sh

#xinput --set-prop "YSPRINGTECH USB OPTICAL MOUSE" "Device Accel Velocity Scaling" 10.0
#xinput --set-prop "YSPRINGTECH USB OPTICAL MOUSE" "Device Accel Constant Deceleration" 1.5
#xinput --set-prop "YSPRINGTECH USB OPTICAL MOUSE" "Device Accel Adaptive Deceleration" 1.5 
source /home/frolov/Software/root_v6.14.06/build/bin/thisroot.sh
#export PATH=$PATH:/usr/lib64/qt4/bin/
#
export GARFIELD_HOME=/home/frolov/Software/GarfieldPP/
export HEED_DATABASE=$GARFIELD_HOME/Heed/heed++/database

export ELMER_HOME=/home/Frolov/Documents/Elmer/install
#export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$ELMER_HOME/lib
#LD_LIBRARY_PATH cannot be set in etc/profile.d/
#see Ubuntu_readme.txt
export PATH=$PATH:$ELMER_HOME/bin

touch /home/frolov/Documents/profile.d.test
echo "PATH=$PATH" >> /home/frolov/Documents/profile.d.test
