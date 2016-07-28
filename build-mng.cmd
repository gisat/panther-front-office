@echo off
REM Windows build script for old Backoffice
call sencha build -p src\appmng.jsb3 -d src
call jsmin <src\appmng.all.js >src\appmng.min.js
