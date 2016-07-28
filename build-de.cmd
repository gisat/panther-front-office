@echo off
REM Windows build script for Data Exploration
call sencha build -p src\appde.jsb3 -d src
call jsmin <src\appde.all.js >src\appde.min.js
