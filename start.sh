#!/bin/sh
# DEBUG=myapp:* yarn start
if command -v npm 2>/dev/null; then
    DEBUG=fintechfinalproject:* npm start
elif command -v yarn 2 >/dev/null; then
    DEBUG=fintechfinalproject:* yarn start
else
    echo "please install npm or yarn"
fi
