#!/bin/bash -ex

PORT=8888
DOT_PORT=8889

rackup -p $PORT ru/SockServer.ru > /dev/null 2>&1 &
rackup -p $DOT_PORT ru/DotServer.ru > /dev/null 2>&1 &
