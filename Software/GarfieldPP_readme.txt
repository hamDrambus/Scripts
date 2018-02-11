Installation of Garfield++ (v ) on Ubuntu 15.10
In the end of this file are the modifications I used for my project
See the documentation of gafield (sparse) at official CERN website.
Also see gmsh and Elmer readmes.

1) CMake installation - compillation from sources from official site. Better use later versions - there is bug for libraries' search for root compilation in early versions (2.?). Cmake required to make root and also may be used to make garfield itself, however, there are problems with the latter.
-----------------------------------------------
-----------------------------------------------
2) For ROOT the following packages required (beside preinstalled) https://root.cern.ch/build-prerequisites (via $apt-get install <name> or $yum install <name> for RedHat based OS):
git
dpkg-dev
cmake
binutils
libx11-dev
libxpm-dev
libxft-dev
libxext-dev
libpng-dev
libjpeg-dev
gfortran (this one is necessary for garfield)
Recommeded (? not sure, but python support will not harm):
python-dev (python 2.7 is pre-unstalled, but not its libraries)

Compilation procedure and parameters:

$ cd to root's build folder
then
	$ $CMAKE_HOME/cmake root_source_folder(with CMakeList.txt) -DCMAKE_INSTALL_PRFIX=<path to root isntall folder. If by default (unix bin folder), then do not specify this parameter> -Dgnuinstall=ON (this one to use default options for Unix OS) -DPYTHON_INCLUDE_DIR=/usr/include/python2.7 -DPYTHON_LIBRARY=/usr/lib/python2.7/config-x86_64-linux-gnu[or just config]/libpython2.7.so (these 2 are required as CMake may have some problem finding them. Beware, that in the message
after this command, if libs are not found, CMake will report that environment variables PYTHON_LIBRARIES and
PYTHON_INCLUDE_DIRS are not pointing to the proper files. This is too some error, use singilar names) -Dbuiltin_gls=ON
(internet acess required as cmake will download GSL tar files and link them internally with ROOT, not sure whether this
option is required) -Ddgml=ON.
    So the command is (example):
	$ cmake ../root-6.08.04 -Dgnuinstall=ON -DPYTHON_INCLUDE_DIR=/usr/include/python2.7 -DPYTHON_LIBRARY=/usr/lib/python2.7/config-x86_64-linux-gnu/libpython2.7.so -Dbuiltin_gsl=ON -Dgdml=ON -DCMAKE_INSTALL_PREFIX=../../root-6.08.04

make sure required componets (and python) are found

	$ cmake --build .
	$ cmake --build . --target install

!!!run root-6.08.04/bin/thisroot.sh to configure environment variables every time new terminal is opened
	$ source bin/thisroot.sh
see UbuntuAndGarfieldPP.txt readme
-----------------------------------------------
-----------------------------------------------
3) Garfield installation follows official guide with limitation of not using cmake - just use make. (mind thisroot.sh configure file)

also for Heed usage env. var. required:
	$ export HEED_DATABASE=$GARFIELD_HOME/Heed/heed++/database
not sure, but $ export GARFIELD_HOME may be necessary too. !!! - all env. variables are temporary and local (e.g for each terminal process).
------------------------------------------------
------------------------------------------------
4) Some changes to the code required/recommended before compilation:
	1) ComponentFieldMap ->FindElement13(...) change in place with comparissons >=0: (-0) issue (mentioned in the official guide).
May be done after compilation with coping required source fiels and compilng them separetely (don't forget to make ComponentElmer dependent of new ComponentFieldMap_My).