from flask import Blueprint, request, jsonify
from src.models.zapi_credentials import ZapiCredentials
from src.models.db_instance import db
import requests

zapi_webhook_bp = Blueprint('zapi_webhook', __name__)

@zapi_webhook_bp.route('/webhook/zapi', methods=['POST'])
def zapi_webhook():
    data = request.get_json()
    # Exemplo: extrair número e mensagem recebida
    phone = data.get('phone') or data.get('from')
    message = data.get('message') or data.get('body')
    user_id = data.get('user_id')  # ou defina a lógica para identificar o usuário
    # Aqui você pode acionar o agente IA para gerar uma resposta automática
    resposta_ia = gerar_resposta_ia(message)  # Implemente sua IA aqui
    # Enviar resposta automática via Z-API
    if resposta_ia and phone and user_id:
        cred = ZapiCredentials.query.filter_by(user_id=user_id).first()
        if cred:
            url = f"https://api.z-api.io/instances/{cred.instance_id}/token/{cred.token}/send-text"
            payload = {"phone": phone, "message": resposta_ia}
            try:
                resp = requests.post(url, json=payload)
                print('Resposta enviada:', resp.json())
            except Exception as e:
                print('Erro ao enviar resposta automática:', str(e))
    print('Evento recebido da Z-API:', data)
    return jsonify({'success': True})

def gerar_resposta_ia(mensagem):
    # Integração real com o agente IA de vendas
    if not mensagem:
        return None

    # Importações locais para evitar ciclos
    from src.models.mcp_agent import MCPAgent
    from src.services.mcp_agent_service import MCPAgentService
    from src.models.campaign import Campaign
    from src.models.user import User

    # Exemplo: buscar o usuário e o agente IA padrão
    user_id = request.json.get('user_id')
    user = User.query.get(user_id) if user_id else None
    agent = MCPAgent.query.filter_by(user_id=user_id, is_active=True).first() if user_id else None

    # Contexto mínimo para IA
    context = {
        'platform': 'whatsapp',
        'customer': {
            'id': request.json.get('from'),
            'name': request.json.get('senderName') or '',
            'phone': request.json.get('phone') or request.json.get('from'),
        }
    }

    # Opcional: buscar campanha ativa do usuário
    campaign = Campaign.query.filter_by(user_id=user_id, status='active').first() if user_id else None
    if campaign:
        context['campaign'] = campaign.to_dict()
        context['sales_strategy'] = campaign.sales_strategy

    if agent:
        ia_service = MCPAgentService()
        result = ia_service.process_message(agent, mensagem, context)
        return result.get('response')
    else:
        return "Recebido: {}. (IA não configurada para este usuário)".format(mensagem)
