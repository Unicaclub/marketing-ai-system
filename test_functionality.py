#!/usr/bin/env python3
"""
Test script to verify button functionality implementations
"""

import requests
import json
import time
import sys
import os

# Add the backend src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'mcp-ai-backend', 'src'))

def test_endpoints():
    """Test the implemented endpoints"""
    base_url = "http://localhost:5000"
    
    # Test WhatsApp settings
    print("Testing WhatsApp settings...")
    whatsapp_data = {
        "whatsapp_token": "test_token",
        "whatsapp_number": "+55 11 99999-9999",
        "webhook_url": "https://test.com/webhook",
        "verification_token": "test_verification",
        "auto_reply": True,
        "continuous_learning": True
    }
    
    try:
        response = requests.post(f"{base_url}/api/platforms/whatsapp/settings", json=whatsapp_data)
        print(f"WhatsApp settings save: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
    except Exception as e:
        print(f"WhatsApp settings test failed: {e}")
    
    # Test Facebook settings
    print("\nTesting Facebook settings...")
    facebook_data = {
        "ad_account_id": "act_1234567890",
        "pixel_id": "1234567890",
        "auto_optimization": True,
        "pause_low_ctr": False,
        "report_frequency": "daily",
        "report_email": "test@example.com"
    }
    
    try:
        response = requests.post(f"{base_url}/api/platforms/facebook/settings", json=facebook_data)
        print(f"Facebook settings save: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Facebook settings test failed: {e}")
    
    # Test Instagram settings
    print("\nTesting Instagram settings...")
    instagram_data = {
        "username": "@testuser",
        "access_token": "test_instagram_token",
        "page_id": "instagram_page_123",
        "auto_post": True,
        "auto_stories": False,
        "default_hashtags": "#marketing #digitalmarketing #business"
    }
    
    try:
        response = requests.post(f"{base_url}/api/platforms/instagram/settings", json=instagram_data)
        print(f"Instagram settings save: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Instagram settings test failed: {e}")
    
    # Test WhatsApp message sending
    print("\nTesting WhatsApp message sending...")
    message_data = {
        "phone_number": "+55 11 99999-9999",
        "message": "Test message from API"
    }
    
    try:
        response = requests.post(f"{base_url}/api/platforms/whatsapp/send-message", json=message_data)
        print(f"WhatsApp message send: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
    except Exception as e:
        print(f"WhatsApp message test failed: {e}")
    
    # Test Facebook campaign creation
    print("\nTesting Facebook campaign creation...")
    campaign_data = {
        "name": "Test Campaign",
        "objective": "conversions",
        "budget": 150
    }
    
    try:
        response = requests.post(f"{base_url}/api/platforms/facebook/campaigns", json=campaign_data)
        print(f"Facebook campaign creation: {response.status_code}")
        if response.status_code == 201:
            print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Facebook campaign test failed: {e}")
    
    # Test Instagram post creation
    print("\nTesting Instagram post creation...")
    post_data = {
        "caption": "Test Instagram post",
        "hashtags": ["#test", "#marketing"],
        "media": []
    }
    
    try:
        response = requests.post(f"{base_url}/api/platforms/instagram/posts", json=post_data)
        print(f"Instagram post creation: {response.status_code}")
        if response.status_code == 201:
            print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Instagram post test failed: {e}")
    
    # Test analytics export
    print("\nTesting analytics export...")
    try:
        response = requests.get(f"{base_url}/api/analytics/export?platform=all&period=30d")
        print(f"Analytics export: {response.status_code}")
        if response.status_code == 200:
            print("Analytics export successful - file downloaded")
    except Exception as e:
        print(f"Analytics export test failed: {e}")

def main():
    print("🚀 Testing button functionality implementations...")
    print("=" * 50)
    
    # Give user some time to start the backend server manually if needed
    print("Make sure the backend server is running on http://localhost:5000")
    print("You can start it with: cd mcp-ai-backend && python src/main.py")
    input("Press Enter when the server is ready...")
    
    # Run tests
    test_endpoints()
    
    print("\n" + "=" * 50)
    print("✅ Testing completed!")
    print("\nFunctionality Summary:")
    print("• WhatsApp: Settings, Export, Message Sending")
    print("• Facebook: Settings, Campaign Creation, Post Creation")  
    print("• Instagram: Settings, Post Creation, Story Creation")
    print("• Analytics: Data Export")
    print("• Chat: File Upload, Voice Recording, Image Upload")
    print("• Authentication: Social Login (Frontend ready)")

if __name__ == "__main__":
    main()