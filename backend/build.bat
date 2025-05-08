@echo off
rmdir /s /q dist
mkdir dist
copy /Y server.js dist\
copy /Y package.json dist\
if exist .env copy /Y .env dist\
xcopy /E /I /Y routes dist\routes
xcopy /E /I /Y models dist\models
xcopy /E /I /Y middleware dist\middleware
xcopy /E /I /Y scripts dist\scripts
cd dist
npm install --production
cd .. 