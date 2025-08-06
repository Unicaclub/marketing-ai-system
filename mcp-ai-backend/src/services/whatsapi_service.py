import requests
from typing import Dict, Any, Optional, List
from flask import current_app

class WhatsAPIService:
    def __init__(self, base_url: str = "https://whatsapi-production-5412.up.railway.app"):
        self.base_url = base_url
        
    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, params: Optional[Dict] = None) -> Dict[str, Any]:
        """Make HTTP request to WhatsAPI"""
        url = f"{self.base_url}{endpoint}"
        try:
            if method.upper() == 'GET':
                response = requests.get(url, params=params, timeout=30)
            elif method.upper() == 'POST':
                response = requests.post(url, json=data, timeout=30)
            elif method.upper() == 'PUT':
                response = requests.put(url, json=data, timeout=30)
            elif method.upper() == 'DELETE':
                response = requests.delete(url, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            response.raise_for_status()
            return response.json() if response.text else {}
        except requests.exceptions.RequestException as e:
            current_app.logger.error(f"WhatsAPI request failed: {e}")
            raise
    
    # Session Management
    def generate_token(self, session: str, secretkey: str) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/{secretkey}/generate-token')
    
    def show_all_sessions(self, secretkey: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{secretkey}/show-all-sessions')
    
    def start_all_sessions(self, secretkey: str) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{secretkey}/start-all')
    
    def check_connection_session(self, session: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/check-connection-session')
    
    def get_qrcode_session(self, session: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/qrcode-session')
    
    def start_session(self, session: str) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/start-session')
    
    def logout_session(self, session: str) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/logout-session')
    
    def close_session(self, session: str) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/close-session')
    
    def get_status_session(self, session: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/status-session')
    
    # Chat Management
    def list_chats(self, session: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/list-chats', data)
    
    def get_all_chats_archived(self, session: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/all-chats-archived')
    
    def get_all_messages_in_chat(self, session: str, phone: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/all-messages-in-chat/{phone}')
    
    def get_all_new_messages(self, session: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/all-new-messages')
    
    def get_all_unread_messages(self, session: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/all-unread-messages')
    
    def get_chat_by_id(self, session: str, phone: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/chat-by-id/{phone}')
    
    def get_message_by_id(self, session: str, message_id: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/message-by-id/{message_id}')
    
    def check_chat_is_online(self, session: str, phone: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/chat-is-online/{phone}')
    
    def get_last_seen(self, session: str, phone: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/last-seen/{phone}')
    
    def list_mutes(self, session: str, type_param: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/list-mutes/{type_param}')
    
    def load_messages_in_chat(self, session: str, phone: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/load-messages-in-chat/{phone}')
    
    def archive_chat(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/archive-chat', data)
    
    def archive_all_chats(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/archive-all-chats', data)
    
    def clear_chat(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/clear-chat', data)
    
    def clear_all_chats(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/clear-all-chats', data)
    
    def delete_chat(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/delete-chat', data)
    
    def delete_all_chats(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/delete-all-chats', data)
    
    def pin_chat(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/pin-chat', data)
    
    def send_mute(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-mute', data)
    
    def send_seen(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-seen', data)
    
    def set_chat_state(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/chat-state', data)
    
    def set_typing(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/typing', data)
    
    def set_recording(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/recording', data)
    
    # Contact & Profile Management
    def get_contact(self, session: str, phone: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/contact/{phone}')
    
    def get_profile(self, session: str, phone: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/profile/{phone}')
    
    def get_profile_pic(self, session: str, phone: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/profile-pic/{phone}')
    
    def get_profile_status(self, session: str, phone: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/profile-status/{phone}')
    
    def get_all_contacts(self, session: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/all-contacts')
    
    # Business Catalog Management
    def get_products(self, session: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/get-products')
    
    def get_product_by_id(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/get-product-by-id', data)
    
    def add_product(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/add-product', data)
    
    def edit_product(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/edit-product', data)
    
    def delete_products(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/del-products', data)
    
    def change_product_image(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/change-product-image', data)
    
    def add_product_image(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/add-product-image', data)
    
    def remove_product_image(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/remove-product-image', data)
    
    def get_collections(self, session: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/get-collections')
    
    def create_collection(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/create-collection', data)
    
    def edit_collection(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/edit-collection', data)
    
    def delete_collection(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/del-collection', data)
    
    def set_product_visibility(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/set-product-visibility', data)
    
    def set_cart_enabled(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/set-cart-enabled', data)
    
    def get_business_profiles_products(self, session: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/get-business-profiles-products')
    
    def get_order_by_message_id(self, session: str, message_id: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/get-order-by-messageId/{message_id}')
    
    # Message Operations
    def get_media_by_message(self, session: str, message_id: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/get-media-by-message/{message_id}')
    
    def download_media(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/download-media', data)
    
    def send_message(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-message', data)
    
    def edit_message(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/edit-message', data)
    
    def send_image(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-image', data)
    
    def send_sticker(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-sticker', data)
    
    def send_sticker_gif(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-sticker-gif', data)
    
    def send_reply(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-reply', data)
    
    def send_file(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-file', data)
    
    def send_file_base64(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-file-base64', data)
    
    def send_voice(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-voice', data)
    
    def send_voice_base64(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-voice-base64', data)
    
    def send_status(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-status', data)
    
    def send_link_preview(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-link-preview', data)
    
    def send_location(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-location', data)
    
    def send_mentioned(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-mentioned', data)
    
    def send_buttons(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-buttons', data)
    
    def send_list_message(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-list-message', data)
    
    def send_order_message(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-order-message', data)
    
    def send_poll_message(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-poll-message', data)
    
    def get_unread_messages(self, session: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/unread-messages')
    
    def get_messages(self, session: str, phone: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/get-messages/{phone}')
    
    def delete_message(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/delete-message', data)
    
    def react_message(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/react-message', data)
    
    def forward_messages(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/forward-messages', data)
    
    def mark_unseen(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/mark-unseen', data)
    
    def contact_vcard(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/contact-vcard', data)
    
    def temporary_messages(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/temporary-messages', data)
    
    def star_message(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/star-message', data)
    
    def get_reactions(self, session: str, reaction_id: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/reactions/{reaction_id}')
    
    def get_votes(self, session: str, vote_id: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/votes/{vote_id}')
    
    def send_link_catalog(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-link-catalog', data)
    
    # Profile Management
    def set_profile_pic(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/set-profile-pic', data)
    
    def set_profile_status(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/profile-status', data)
    
    def change_username(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/change-username', data)
    
    def edit_business_profile(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/edit-business-profile', data)
    
    # Status Stories
    def send_text_story(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-text-storie', data)
    
    def send_image_story(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-image-storie', data)
    
    def send_video_story(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/send-video-storie', data)
    
    # Labels Management
    def add_new_label(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/add-new-label', data)
    
    def add_or_remove_label(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/add-or-remove-label', data)
    
    def get_all_labels(self, session: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/get-all-labels')
    
    def delete_all_labels(self, session: str) -> Dict[str, Any]:
        return self._make_request('PUT', f'/api/{session}/delete-all-labels')
    
    def delete_label(self, session: str, label_id: str) -> Dict[str, Any]:
        return self._make_request('PUT', f'/api/{session}/delete-label/{label_id}')
    
    # Group Management
    def get_group_members(self, session: str, group_id: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/group-members/{group_id}')
    
    def get_common_groups(self, session: str, wid: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/common-groups/{wid}')
    
    def get_group_admins(self, session: str, group_id: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/group-admins/{group_id}')
    
    def get_group_invite_link(self, session: str, group_id: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/group-invite-link/{group_id}')
    
    def revoke_group_invite_link(self, session: str, group_id: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/group-revoke-link/{group_id}')
    
    def get_group_members_ids(self, session: str, group_id: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/group-members-ids/{group_id}')
    
    def create_group(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/create-group', data)
    
    def leave_group(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/leave-group', data)
    
    def join_group_by_code(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/join-code', data)
    
    def add_participant_group(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/add-participant-group', data)
    
    def remove_participant_group(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/remove-participant-group', data)
    
    def promote_participant_group(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/promote-participant-group', data)
    
    def demote_participant_group(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/demote-participant-group', data)
    
    def get_group_info_from_invite_link(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/group-info-from-invite-link', data)
    
    def set_group_description(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/group-description', data)
    
    def set_group_property(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/group-property', data)
    
    def set_group_subject(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/group-subject', data)
    
    def set_messages_admins_only(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/messages-admins-only', data)
    
    def set_group_pic(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/group-pic', data)
    
    def change_privacy_group(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/change-privacy-group', data)
    
    # Community Management
    def create_community(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/create-community', data)
    
    def deactivate_community(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/deactivate-community', data)
    
    def add_community_subgroup(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/add-community-subgroup', data)
    
    def remove_community_subgroup(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/remove-community-subgroup', data)
    
    def promote_community_participant(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/promote-community-participant', data)
    
    def demote_community_participant(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/demote-community-participant', data)
    
    def get_community_participants(self, session: str, community_id: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/community-participants/{community_id}')
    
    # Newsletter Management
    def create_newsletter(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/newsletter', data)
    
    def update_newsletter(self, session: str, newsletter_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('PUT', f'/api/{session}/newsletter/{newsletter_id}', data)
    
    def delete_newsletter(self, session: str, newsletter_id: str) -> Dict[str, Any]:
        return self._make_request('DELETE', f'/api/{session}/newsletter/{newsletter_id}')
    
    def mute_newsletter(self, session: str, newsletter_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/mute-newsletter/{newsletter_id}', data)
    
    # Miscellaneous Operations
    def get_platform_from_message(self, session: str, message_id: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/get-platform-from-message/{message_id}')
    
    def clear_session_data(self, session: str, secretkey: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/{secretkey}/clear-session-data', data)
    
    def subscribe_presence(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/subscribe-presence', data)
    
    def get_all_broadcast_list(self, session: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/all-broadcast-list')
    
    def reject_call(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/reject-call', data)
    
    def check_number_status(self, session: str, phone: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/check-number-status/{phone}')
    
    def get_blocklist(self, session: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/blocklist')
    
    def block_contact(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/block-contact', data)
    
    def unblock_contact(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/unblock-contact', data)
    
    def get_battery_level(self, session: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/get-battery-level')
    
    def get_host_device(self, session: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/host-device')
    
    def get_phone_number(self, session: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/get-phone-number')
    
    def backup_sessions(self, secretkey: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{secretkey}/backup-sessions')
    
    def restore_sessions(self, secretkey: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{secretkey}/restore-sessions', data)
    
    def take_screenshot(self, session: str) -> Dict[str, Any]:
        return self._make_request('GET', f'/api/{session}/take-screenshot')
    
    def set_limit(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/set-limit', data)
    
    def chatwoot_integration(self, session: str, data: Dict[str, Any]) -> Dict[str, Any]:
        return self._make_request('POST', f'/api/{session}/chatwoot', data)
    
    # Health Check
    def health_check(self) -> Dict[str, Any]:
        return self._make_request('GET', '/healthz')
    
    def unhealthy_check(self) -> Dict[str, Any]:
        return self._make_request('GET', '/unhealthy')
    
    def get_metrics(self) -> Dict[str, Any]:
        return self._make_request('GET', '/metrics')