@echo off
set CAEN_folder=240404
set channels_to_delete=2 6 9 10 11 12 13 14 15 45 46 47 60 61 62 63
setlocal EnableExtensions EnableDelayedExpansion
set i=0
set chars=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_.
for %%c in (%channels_to_delete%) do (
	for /R %CAEN_folder% %%f in (run_*__ch_%%c.dat) do (
		set /A i+=1
		set files_to_remove[!i!]=%%~ff
	)
)

set files_N=%i%
if %files_N% EQU 0 goto NoFilesFound

echo Will delete the following files:
for /L %%i in (1,1,%files_N%) do echo "!files_to_remove[%%i]!"
echo Total %files_N% files will be deleted.
:UseChoice
%SystemRoot%\System32\choice.exe /C YN /N /M "Are you sure [Y/N]?"
if not errorlevel 1 goto UseChoice
if errorlevel 2 exit /B

for /L %%i in (1,1,%files_N%) do del "!files_to_remove[%%i]!"
endlocal
exit /B

:NoFilesFound
echo No files to delete were found.
pause
endlocal