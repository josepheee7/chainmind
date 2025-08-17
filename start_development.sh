#!/bin/bash

echo "Starting ChainMind AI Development Environment..."
echo

echo "🚀 Building and starting Docker containers..."
docker-compose down
docker-compose build
docker-compose up -d

echo
echo "✅ ChainMind AI is starting up!"
echo
echo "🌐 Frontend will be available at: http://localhost:3000"
echo "🧠 Backend API will be available at: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo
echo "Waiting for services to be ready..."
sleep 10

echo
echo "🔍 Checking service health..."
if curl -f http://localhost:8000/health >/dev/null 2>&1; then
    echo "✅ Backend is healthy!"
else
    echo "⚠️  Backend may still be starting up..."
fi

echo
echo "🎯 Ready for development!"
echo "Press Ctrl+C to stop all services"
echo

docker-compose logs -f
