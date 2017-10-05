see official website guide

0) Env. Var Path =
...;F:\Qt_5.7.0\src-5.7.0\gnuwin32\bin;F:\Qt_5.7.0\src-5.7.0\qtbase\bin;

1) Use Visual Studio Command Prompt!
2) "F:\Program Files (x86)\Microsoft Visual Studio 12.0\Common7\Tools\vsvars32.bat"
3) cd to F:/Qt_5.7.0 
//this is build directory
4) "src-5.7.0\configure" -prefix F:\Qt_5.7.0 -debug -nomake examples -opensource -platform win32-msvc2013

//mind slashes in the paths! use \, not a /
