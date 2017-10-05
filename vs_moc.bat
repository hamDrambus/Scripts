setlocal ENABLEDELAYEDEXPANSION
set fnf=%1
set fnf=!fnf:~1,-3!
set fnf=qt_moc\moc_!fnf!
set fnf=!fnf!.cpp
%QTDIR%\bin\moc %1 -o !fnf!
type !fnf! >> qt_moc\QT_MOC_.cpp