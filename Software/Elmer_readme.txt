--------- ------------ ------------- -------------- ----------------- -------------- --- ----- window width: -------------|
Used verion 8.2 release.
	0) Elmer libs and bin must be set in LD_LIBRARY_PATH and PATH correspondly (as in official manual)
	LD_LIBRARY_PATH can't be set in initializing .sh script in /etc/profile.d/my_startup.sh (see Ubuntu.txt)

See pdfs in GarfieldPP_transparency/software_pdfs
	1) gmsh's .msh file must be converted by ElmerGrid.exe in cmd:
cmd>Elmer/bin/ElmerGrid.exe 14 2 gmsh_output.msh -autoclean
(see pdf, but 14 2 is some format codes and -autoclean makes some optimizations) Output files are in ElmerGrid.exe/models
	1.5) In order to check that the mesh format is right, open .elements file (as it is typically huge use Vim editor).
There must be 510 code and 10 numbers after in each line.
	2) Load output folder of ElmerGrid.exe by ElmerGUI
	3) Model->Setup press accept (writes default info into solution info file - .sif file)
	4) Set up:
		*Materials
		*Equation - better to set for every volume. Activate Electostatic equation. In 'Edit solver settings'
	tolerances can be tuned (e-11~-10 is ok for convergence toler.). Potential solving is linear system. Don't know
	what are 'after tolerance' and 'ILUT tolerance' (set to 1e-3 by default) but I changed them to 1e-4.
		*Initial conditions are not required
		*Boundary conditions: see example sifs on how to use boundary conditions. Boundary conditions are better to
	be set via editing sif file directly (Sif->Edit ... safe as->overwrite). Normal potential conditions are to be set
	firstly in GUI. Be sure that project is saved AND new sif is written atop the old one.
		*Besides periodic BC add (without qoutes) "Output File = case.result" where case can be any name (as
	extension really) in 'Solution' section (any place). Ohterwise there will be no file required for Garfield++.
	5) Press solve.
	6) Garfield requires relative permitivity disription. This file should be created manually. Format:
|diels.dat
|_________
|<num_of_volumes>
|Num1 Relative_perm_1
|....
|NumLast Rel_perm_last
|____________
|EndOfFile
e.g:

4
1 1
2 1
3 3.2
4 1.01

Mind that this is description of volumes, not materials of Elmer.
===========================================================================================================================
In order to decrease memory consuption (and actually time for loading model) ElmerSolver can be run via terminal:
	>cd to folder containing mesh
	>ElmerSolver path/to/solution.sif
No modification to Mesh DB line in .sif header required.
