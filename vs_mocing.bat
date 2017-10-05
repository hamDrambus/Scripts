echo applying mocing
copy NUL qt_moc\QT_MOC_.cpp
forfiles /m *.h /c "cmd /c if not @isdir==true call %SCR_%\vs_moc.bat @file"