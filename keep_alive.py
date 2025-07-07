#!/usr/bin/env python3
"""
Keep alive script for Replit deployment
This helps maintain the server running
"""
import threading
import time
import requests
from app import app

def keep_alive():
    """Ping the server every 5 minutes to keep it alive"""
    while True:
        try:
            time.sleep(300)  # Wait 5 minutes
            requests.get('http://localhost:5000', timeout=5)
            print("Keep-alive ping sent")
        except Exception as e:
            print(f"Keep-alive error: {e}")

if __name__ == '__main__':
    # Start keep-alive thread
    keep_alive_thread = threading.Thread(target=keep_alive, daemon=True)
    keep_alive_thread.start()
    
    # Start the Flask app
    app.run(host='0.0.0.0', port=5000, debug=False)