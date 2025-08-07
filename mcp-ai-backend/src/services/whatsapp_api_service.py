import requests

WHATSAPI_URL = "https://whatsappi-production-5412.up.railway.app"

def start_session(phone):
    return requests.post(f"{WHATSAPI_URL}/api/start-session", json={"phone": phone}).json()

def list_sessions():
    return requests.get(f"{WHATSAPI_URL}/api/list-sessions").json()

def logout_session(session_id):
    return requests.post(f"{WHATSAPI_URL}/api/logout-session", json={"session": session_id}).json()

def send_message(session, phone, message):
    payload = {"session": session, "phone": phone, "message": message}
    return requests.post(f"{WHATSAPI_URL}/api/send-message", json=payload).json()

def send_image(session, phone, image_url, caption=""):
    payload = {"session": session, "phone": phone, "image": image_url, "caption": caption}
    return requests.post(f"{WHATSAPI_URL}/api/send-image", json=payload).json()

def send_file(session, phone, file_url, filename):
    payload = {"session": session, "phone": phone, "file": file_url, "filename": filename}
    return requests.post(f"{WHATSAPI_URL}/api/send-file", json=payload).json()

def send_sticker(session, phone, sticker_url):
    payload = {"session": session, "phone": phone, "sticker": sticker_url}
    return requests.post(f"{WHATSAPI_URL}/api/send-sticker", json=payload).json()

def send_contact(session, phone, contact):
    payload = {"session": session, "phone": phone, "contact": contact}
    return requests.post(f"{WHATSAPI_URL}/api/send-contact", json=payload).json()

def send_location(session, phone, latitude, longitude, description=""):
    payload = {"session": session, "phone": phone, "latitude": latitude, "longitude": longitude, "description": description}
    return requests.post(f"{WHATSAPI_URL}/api/send-location", json=payload).json()
