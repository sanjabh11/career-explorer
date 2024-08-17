@echo off

 
set NETLIFY_DIR=netlify\functions
set VERCEL_DIR=api

 
if not exist %VERCEL_DIR% (
    mkdir %VERCEL_DIR%
)

 
copy %NETLIFY_DIR%\onet-details.js %VERCEL_DIR%\
copy %NETLIFY_DIR%\onet-proxy.js %VERCEL_DIR%\
copy %NETLIFY_DIR%\onet-search.js %VERCEL_DIR%\

echo Functions duplicated successfully.