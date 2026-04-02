#!/bin/bash
echo "🐄 Starting PashuSeva..."
echo ""

# Start backend in background
echo "📡 Starting Backend API on port 5000..."
cd backend && npm install --silent && node server.js &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
sleep 2

# Start frontend
echo ""
echo "⚛️  Starting Frontend on port 3000..."
cd ../frontend && npm install --silent && npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null; echo 'Stopped.'" EXIT
