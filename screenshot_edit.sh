#!/bin/bash

picsdir=~/Pictures/screenshot_tmp.png
gnome-screenshot -f "$picsdir"
gimp "$picsdir"
 
