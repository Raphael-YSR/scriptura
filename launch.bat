@echo off
REM Change to the directory where the batch file is located
cd /d "D:\Projects\code\Scripture DB"

REM Launch the Node.js server invisibly using the VBScript
start "" wscript.exe "launch_server.vbs"

REM Optionally, you can add a small delay and then open the browser
timeout /t 2 /nobreak
start http://localhost:3000

echo Bible.EX application launched invisibly.
exit
