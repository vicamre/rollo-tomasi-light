#!/usr/bin/env python3
"""
Simple script to start the light server on port 8080
"""
from app import app

if __name__ == "__main__":
    print("🌊 Starting Rollo Tomasi Light on http://localhost:8080")
    app.run(host="0.0.0.0", port=8080, debug=True)
