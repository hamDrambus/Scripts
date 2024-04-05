@echo off
set CAEN_folder=240404
setlocal EnableExtensions EnableDelayedExpansion
set chars=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_.
set n=0
for /D %%d in (%CAEN_folder%\*) do (
	set i=0
	for %%f in (%%~fd\run_*__ch_*.dat) do (
		for /f "tokens=1,2 delims=%chars%" %%j in ("%%~nf") do (
		 	set run_n=%%j
		)
		if !i! EQU 0 (
			set /A i+=1
			set max_run=!run_n!
		) else (
			if !max_run! LSS run_n set max_run=!run_n!
		)
	)
	set /A n+=1
	set folders[!n!]=%%~fd
	set runs[!n!]=!max_run!
	rem echo "Max run number for folder %%~nd is !max_run!"
)

set files_N=%n%
if %files_N% EQU 0 goto NoFilesFound

set nfiles=0
for /L %%i in (1,1,%files_N%) do (
	for %%f in (!folders[%%i]!\run_!runs[%%i]!__ch_*.dat) do (
		set /A nfiles+=1
		set files_to_remove[!nfiles!]=%%~ff
	)
)
set files_N=%nfiles%
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