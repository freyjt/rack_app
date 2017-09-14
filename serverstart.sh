#!/bin/bash -ex

PORT=8888

rackup -p $PORT SockServer.ru &
