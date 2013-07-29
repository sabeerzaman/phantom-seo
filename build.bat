@echo off
set sshkey=%1
set remote=%2

echo.
echo "Running Grunt tasks on JavaScript files..."

call grunt

IF %ERRORLEVEL% EQU 0 (
	Echo Grunt Tasks successfully completed!
) ELSE (
	Echo There were errors in the Grunt Tasks :S
	exit /b %ERRORLEVEL%
)

echo.
echo "Stopping node-server during build process"
ssh -i %sshkey% -o StrictHostKeychecking=no ubuntu@%remote% "/var/node-server/stop_server"

IF %ERRORLEVEL% EQU 0 (
	Echo Successfully stopped node-server
) ELSE (
	Echo There was an error stopping the node-server
REM	exit /b %ERRORLEVEL%
)

echo.
echo "Syncing public files with remote instance..."
rsync -e "ssh -i %sshkey% -o StrictHostKeychecking=no" -avz --exclude /node-server --exclude .git --exclude /specs --exclude /node_modules --exclude Gruntfile.js --exclude package.json --exclude .gitignore --exclude build.bat --exclude sync.bat . ubuntu@%remote%:/var/www/
ssh -i %sshkey% -o StrictHostKeychecking=no ubuntu@%remote% "sudo chmod -R 0755 /var/www"

IF %ERRORLEVEL% EQU 0 (
	Echo Succesfully synced public files with remote instance 
) ELSE (
	Echo There were errors in syncing public files with remote instance
	exit /b %ERRORLEVEL%
)

echo.
echo "Syncing node-server files with remote instance..."
cd node-server
rsync -e "ssh -i %sshkey% -o StrictHostKeychecking=no" -avz --exclude /node_modules --exclude '*.log' --exclude stop_server --exclude start_server . ubuntu@%remote%:/var/node-server
cd ..

IF %ERRORLEVEL% EQU 0 (
	Echo Succesfully synced node-server files with remote instance 
) ELSE (
	Echo There were errors in syncing node-server files with remote instance
	exit /b %ERRORLEVEL%
)

echo.
echo "Installing any new dependencies via NPM..."
ssh -i %sshkey% -o StrictHostKeychecking=no ubuntu@%remote% "cd /var/node-server; sudo npm install"

echo.
echo "Restarting node-server"
ssh -i %sshkey% -o StrictHostKeychecking=no ubuntu@%remote% "/var/node-server/start_server"

IF %ERRORLEVEL% EQU 0 (
	Echo Successfully restarted node-server
) ELSE (
	Echo There was an error restarting the node-server
REM	exit /b %ERRORLEVEL%
)

echo.
echo "Restarting Apache server"
ssh -i %sshkey% -o StrictHostKeychecking=no ubuntu@%remote% "sudo service apache2 restart"

IF %ERRORLEVEL% EQU 0 (
	Echo Successfully restarted Apache
) ELSE (
	Echo There was an error restarting Apache
REM	exit /b %ERRORLEVEL%
)

echo.
echo Error Level: %ERRORLEVEL%

set sshkey=
set remote=

exit /b 0