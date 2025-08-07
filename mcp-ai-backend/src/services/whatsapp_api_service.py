import requests

WHATSAPI_BASE_URL = "https://whatsapi-production-5412.up.railway.app/wpp"

def start_session(phone):
    url = f"{WHATSAPI_BASE_URL}/session/start"
    payload = {"phone": phone}
    try:
        response = requests.post(url, json=payload)
        if response.headers.get('Content-Type', '').startswith('application/json'):
            return response.json()
        else:
            return {
                "error": True,
                "status_code": response.status_code,
                "text": response.text,
                "details": "Resposta do WhatsApi não é JSON."
            }
    except Exception as e:
        return {
            "error": True,
            "details": str(e)
        }

def list_sessions():
    url = f"{WHATSAPI_BASE_URL}/session/list"
    response = requests.get(url)
    return response.json()

def remove_session(session_name):
    url = f"{WHATSAPI_BASE_URL}/session/{session_name}"
    response = requests.delete(url)
    return response.json()

def send_text(session, phone, message):
    url = f"{WHATSAPI_BASE_URL}/send-text"
    payload = {"session": session, "phone": phone, "text": message}
    response = requests.post(url, json=payload)
    return response.json()

def send_image(session, phone, image, caption=""):
    url = f"{WHATSAPI_BASE_URL}/send-image"
    payload = {"session": session, "phone": phone, "image": image, "caption": caption}
    response = requests.post(url, json=payload)
    return response.json()

def send_file(session, phone, file, filename):
    url = f"{WHATSAPI_BASE_URL}/send-file"
    payload = {"session": session, "phone": phone, "file": file, "filename": filename}
    response = requests.post(url, json=payload)
    return response.json()

def send_sticker(session, phone, sticker):
    url = f"{WHATSAPI_BASE_URL}/send-sticker"
    payload = {"session": session, "phone": phone, "sticker": sticker}
    response = requests.post(url, json=payload)
    return response.json()

def send_contact(session, phone, contact):
    url = f"{WHATSAPI_BASE_URL}/send-contact"
    payload = {"session": session, "phone": phone, "contact": contact}
    response = requests.post(url, json=payload)
    return response.json()

def send_location(session, phone, latitude, longitude, description=""):
    url = f"{WHATSAPI_BASE_URL}/send-location"
    payload = {
        "session": session,
        "phone": phone,
        "latitude": latitude,
        "longitude": longitude,
        "description": description
    }
    response = requests.post(url, json=payload)
    return response.json()
