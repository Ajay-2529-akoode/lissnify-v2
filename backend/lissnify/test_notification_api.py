#!/usr/bin/env python
"""
Test script to test notification API endpoints
"""
import requests
import json

# Test the notification API
API_BASE = "http://localhost:8000/api"

def test_notification_api():
    print("🧪 Testing Notification API...")
    
    # You'll need to replace this with a valid adminToken from your localStorage
    # Get it from: localStorage.getItem('adminToken') in browser console
    admin_token = input("Enter your adminToken from localStorage: ").strip()
    
    if not admin_token:
        print("❌ No token provided")
        return
    
    headers = {
        'Authorization': f'Bearer {admin_token}',
        'Content-Type': 'application/json'
    }
    
    # Test 1: Create a test notification
    print("\n1️⃣ Testing notification creation...")
    try:
        response = requests.post(f"{API_BASE}/notifications/test/", headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 2: Get notifications
    print("\n2️⃣ Testing notification list...")
    try:
        response = requests.get(f"{API_BASE}/notifications/", headers=headers)
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Found {len(data.get('notifications', []))} notifications")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 3: Get notification stats
    print("\n3️⃣ Testing notification stats...")
    try:
        response = requests.get(f"{API_BASE}/notifications/stats/", headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Stats: {response.json()}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_notification_api()
