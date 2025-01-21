@echo on
SET PGPASSWORD=SQL1984superuser
SET BACKUP_PATH=C:\PostgreSQL_Backups\2024
echo Creating backup in %BACKUP_PATH%
SET DATE_STAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%

IF NOT EXIST "%BACKUP_PATH%" (
    echo Creating backup directory
    mkdir "%BACKUP_PATH%"
)

echo Running pg_dump...
"C:\Program Files\PostgreSQL\17\bin\pg_dump.exe" -h localhost -U postgres -F c -b -v -f "%BACKUP_PATH%\todopro_%DATE_STAMP%.backup" todopro

IF %ERRORLEVEL% NEQ 0 (
    echo Backup failed with error %ERRORLEVEL%
) ELSE (
    echo Backup completed successfully!
    echo Backup file should be in: %BACKUP_PATH%\todopro_%DATE_STAMP%.backup
)
dir "%BACKUP_PATH%"
pause
