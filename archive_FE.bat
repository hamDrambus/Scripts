@Echo Off

SET infolder=180705
SET outfolder=180705_caen_archive
echo Zipping all subfolders in "%infolder%"
FOR /F %%S IN ('dir /b /a:d "%infolder%\*"') DO ((if not exist "%outfolder%" mkdir "%outfolder%") ^
 && (C:\Software\WinRAR\WinRAR.exe a -r -afzip -ep1 -m5 "%outfolder%\%%S.zip" "%infolder%\%%S\") ^
 & (if %ERRORLEVEL% GEQ 1 (echo Failed to zip "%infolder%\%%S") else (echo Ziped "%infolder%\%%S" into "%outfolder%\%%S.zip")))

pause
@Echo On