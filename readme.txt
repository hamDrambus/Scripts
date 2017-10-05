vs_moc.bat and vs_mocing.bat are for runing during custom build event in Visual Studio of Qt's Meta Object Copiler 
(for full functionality (e.g. slots/signals interface) Qt must preparcer headers and generate corresponding src (.cpp) 
files. These bats are run for input VS headers and generate merged cpp file: $PROJECT_DIR$\qt_moc\QT_MOC_.cpp which must 
be included in Visual Studio project explicitly)
---------------
chrome_patcher.bat - modifies google's chrome.dll to disable developer mode warning (when using not published extensions)
taken from somewhere at stackoverflow
---------------
EnvVars.bat - runs Windows' environment variables editor. Must be run as admin so shortcut is used (bat cannot be 
scpecified as with admin access).
---------------
KabutoVM_cpuid0x4_masked.bat - masks some bits in virtual processor ID in Oracle Virtual Machine. Required in order for solidworks to not figure it run in virtual box. Path to Oracle.exe should be fixed if needed. Attention! This works only in the case of one hard drive. Somehow in case of several drives Solidworks figures out it runs on VM.
!Addition: also single hard disk required for solidworks installation, otherwise VM is compromised.

