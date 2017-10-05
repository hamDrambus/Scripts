---------- --------         ---------        -----------       -----------      ---------  window width: ---- -----   ----|
use 3. versions (I used 3.0.2 x64) as the third version has no problem with export of mesh.

	1) For proper mesh it should be exported as version 2 ANCII format and save all option that is with 'ignore
physical volumes' checked and the rest 2 options unchecked. This is possible in version 2 but via 'save as'. If save mesh
is used, no dialogue with options is shown.
	2) .geo format is the 'project' format of gmsh. It only stores geometry related stuff and some of mesh options
(mesh size fields). There are two factories: build-in and CASCADE. CASCADE has strange and buggy behaviour:
		* (?) it has caching: deleting object with tag N0 results in that it is not possible to create new object
	with N0 (the solid order of surfaces and volumes may be important (unchecked) when trasfering mesh to ELmer
	formats. In order to not check numbers in clumsy Elmer (can't show by numbers and volume mesh results in freeze) 
	it is convinient to preserve gmsh's numbering).
		* (!) Curved surfaces (surface filling in add elementary entity commands) can't be used to create volume
	(probably because of slits)
		* (!) buggy plane surfaces with holes: holes are not created as expected. Can be fixed in 4-line countour
	case by swapping 2 consecutive pairs of tags in contour loop, e.g.  (1, 2, 3, 4) -> (3, 4, 1, 2). Check validity of
	surface via view menu.
		* crushes sometimes
		* (if .STEP format is imported by OPEN CASCADE) .STEP files are imported wrongly: can't create volumes,
	adding of entities (lines and surfaces) will result in crush. Version 2. of gmsh is ok with importing .STEP
		* Valid curve surfaces can be only created by creating full 3d entities such as cylinder. Their elements
	can be later deleted. The problem is some definitions are not full, e.g. you can't rotate the cylinder.
So better to use built-in factory.
	
	3) For Garfield 2nd order meshing is required. Set 2nd order in both left panel and Tools->Options->Mesh->General.
Can be checked whether mesh is 2nd order only after translating .msh to Elmer files (see Elmer readme)
	4) After initial meshing size fields' change won't take effect. Reload required. (mind File->Clear and left panel)
	5) When hiding surface which is part of volume in Tool->visibility the surface must be unchecked in both the 
Volume section (for every volume it is part of) and the surfaces block. Mind 'Apply recursively' (in hierarchy) option.
	6) After creating geometry and size field (must be set as background) save .geo. Load it, then set required options
(order of mesh, size factors, min/max size et al), then apply meshing Modules->Mesh->3D. Othervise some of the options may
be not applied (size fields take effect on reload, but Tool->Options discard at relaunch).
	7) Importing solidworks' files (and I gather other cAD geometries) will result in double surface which is
unacceptable.