#!/bin/bash 
docker-compose up -d
echo "Backend servers are running"
cd nextjs-client
echo "Client build is starting.."
docker build . -t kinexon/client --network=host
echo "Client image is ready"
docker run -d -p 3000:3000 kinexon/client 
echo "Client is running"
