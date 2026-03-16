#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

BUILD_PID=""
AEM_PID=""

kill_process() {
    local pid=$1
    local name=$2
    [ -z "$pid" ] && return
    if kill -0 "$pid" 2>/dev/null; then
        echo -e "${YELLOW}Stopping $name...${NC}"
        kill -TERM "$pid" 2>/dev/null
        sleep 0.5
        kill -0 "$pid" 2>/dev/null && kill -9 "$pid" 2>/dev/null
    fi
}

cleanup() {
    echo -e "\n${YELLOW}Shutting down...${NC}"
    kill_process "$BUILD_PID" "build watcher"
    kill_process "$AEM_PID" "AEM"
    echo -e "${GREEN}Done${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

echo -e "${GREEN}Starting development environment...${NC}"
node build.js --watch &
BUILD_PID=$!
sleep 1

(cd ../.. && aem up &> /dev/null) &
AEM_PID=$!

echo -e "You can find the built file at ${GREEN}http://localhost:3000/libs/global-navigation/dist/main.js${NC}"
echo -e "${GREEN}Ready - Press Ctrl+C to stop${NC}"
echo -e "Build: $BUILD_PID | AEM: $AEM_PID"

wait $BUILD_PID $AEM_PID
