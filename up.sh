#!/bin/bash

# echo "http://localhost:3000/"
#
# tmux split-window -v npm run dev

docker compose build
docker compose up
