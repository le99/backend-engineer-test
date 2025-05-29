#!/bin/bash

#gnome-terminal --tab -- bash -c "cd ./server; npm run dev"

echo "http://localhost:3000/"

tmux split-window -v npm run dev
