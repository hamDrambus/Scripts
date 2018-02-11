Installation of Gafireld++ (v ) on Ubuntu 15.10
In the end of this file are the modifications I used for my project
See the documentation of gafield (sparse) at official CERN website.
Also see gmsh and Elmer readmes.

1) CMake installation - compillation from sources from official site. Better use later versions - there is bug for libraries' search for root compilation in early versions (2.?). Cmake required to make root and also may be used to make garfield itself, however, there are problems with the latter as certain root componets couldn't be found or, if are, there are 'make' errors.
-----------------------------------------------
-----------------------------------------------
2) For ROOT the following packages required (beside preintalled) https://root.cern.ch/build-prerequisites (via apt-get install <name>):
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
	$ $CMAKE_HOME/cmake root_source_folder(with CMakeList.txt) -DCMAKE_INSTALL_PRFIX=<path to root isntallfolder. If by default (unix bin folder), then do not specify this parameter> -Dgnuinstall=ON (this one to use default options for Unix OS) -DPYTHON_INCLUDE_DIR=/usr/include/python2.7 -DPYTHON_LIBRARY=/usr/lib/python2.7/config-x86_64-linux-gnu[or just config]/libpython2.7.so (these 2 are required as CMake may have some problem finding them. Beware, that in the message
after this command, if libs are not found, CMake will report that environment variables PYTHON_LIBRARIES and
PYTHON_INCLUDE_DIRS are not pointing to the proper files. This is too some error, use singilar names) -Dbuiltin_gls=ON
(internet acess required as cmake will download GSL tar files and link them internally with ROOT, not sure whether this
option is required) -Ddgml=ON (cmake+garfieldPP writes that it can not find dgml component of ROOT so this is an attempt
to fix it. It is unclear though whether this does work, I believe that OpenGL is also requred. With make+garfield
everything works fine).
    So the command is (example):
	$ cmake ../root-6.08.04 -Dgnuinstall=ON -DPYTHON_INCLUDE_DIR=/usr/include/python2.7 -DPYTHON_LIBRARY=/usr/lib/python2.7/config-x86_64-linux-gnu/libpython2.7.so -Dbuiltin_gsl=ON -Dgdml=ON -DCMAKE_INSTALL_PREFIX=../../root-6.08.04

make sure required componets (and python) are found

	$ cmake --build .
	$ cmake --build . --target install

!!!run root-6.08.04/bin/thisroot.sh to configure env. var-s  - every time new terminal is opened
	$ source bin/thisroot.sh
see UbuntuAndGarfieldPP.txt readme
-----------------------------------------------
-----------------------------------------------
3) Garfield installation follows official guide with limitation of not using cmake - just use make. (mind thisroot.sh configure file)

In order to compile example changes to makefile may be requred (are required if root libs are used)
	1) in makefile 'root-config --glibs' and 'root-config --cflags' and etc if any must be replaced by the output with root-config with corresponding options - this is paths to libs and compiler's options
	2) swith order of library linkage (with corresponding flags) in LDFLAGS - dependent libs (=garfield) first (root - 2nd)

also for Heed usage env. var. required:
	$ export HEED_DATABASE=$GARFIELD_HOME/Heed/heed++/database
not sure, but $ export GARFIELD_HOME may be necessary too. !!! - all env. variables are temporary and local (e.g each terminal process).

	UPD: makefile example is located in source folder in GarfieldPP_transparency/ReportGarf/src/
or in reproducing Sauli
------------------------------------------------
------------------------------------------------
4) Some changes to the code required/recommended (TODO: save the modified (or all) files to github):
	1) ComponentFieldMap ->FindElement13(...) change in place with comparissons >=0: (-0) issue (mentioned in guide).
May be done after compilation with coping required source fiels and compilng them separetely (don't forget to make ComponentElmer dependent of new ComponentFieldMap_My).
	2) If some modifications to mapping are in plans (such as hexagonal grid) then method
void ComponentFieldMap::Mapcoordinates(...) cosnt; should be made virtual (UPD: doesn't work - changes to the source seems to be the only choice). Otherwise very cumbersome manual modifications, linking and compiling of code required in order to redefine Mapping so that all the rest of modules are using the new method. (if only for for field calculations, then modifications in ComponentElmer_My (or ComponentFieldMap_My) are enough, but thr drawing of the mesh will stay broken).
	UPD: changes to the source: in MapCoordinates(...) and UpdatePeriodicityCommon() (+variable for enabling hexagonal mapping). The hexagonal mapping functions are in PseudoMesh.cc in my geant4 light efficiency project. Important is that those function have x=y=0 not in the center of hexagon but in the corner of bounding rectangle (see A4 notes and pictures on that). Also std::abs(double) must be used instead of simple abs (returns 0) as it seems there is redefinition in garfield++ or ubuntu.
	UPD#2: changes in ComponentFieldMap are not enough: ViewFEMesh is a friend of ComponentFieldMap and handles
periodicities separately. Hence it's required to add hex mapping there too.
	UPD#3: Above method was suceesful, yet there is a lot of strange non-critical error (no inverse matrix)
	3) For more convinient drift drawings adding "positron" to the AvalancheMC (or similar) may be done. For that the change in the sign of drift velocity, obtained from Medium->GetElectronVelocity(...) called in AvalancheMc->DriftElectron() in enough (+ wrapping method, adding new particle type).
	4) Diffusion coefficients in Medium class are not in usual units ([cm^2/sec]) but in [cm^-1/2] so conversion must be made (). The formula is taken as in magboltsz
. In magboltz-9.01.f it is stated that D are calculated (in fortran I
guess) in cm^2/sec, i.e. using the same units as in input files
, but then they are converted in cm^-1/2 by dividing by
velocity in MediumMagbolts.cc
, Hence I do the same in my LAr_Material, only my velocity is in cm/sec, not in cm/ns:
	dl = std::sqrt(2*Dl(E)/velocity(E));
  
	dt = std::sqrt(2*Dt(E)/velocity(E));
where E is field in V/cm and dl and dt are coeffs. used if AvalanceMC and all over the Garfield++. Dl and Dt are normal longitudial and transverse diffusion coefs. in cm^2/sec
	5) There is bug in setting areas and regions of interest. For example when setting sensor area (dx,dy,dz) and then
adding plane view (0,1,0), the plane will be limited by dx_in_plane ===dz_in_sensor_area and dy_in_plane also===
dz_in_senor_area. Workaround: experiment with parameters and figure out the right ones or set them to be big enough.
TODO: fix the Garfield code (or I don't understand something).