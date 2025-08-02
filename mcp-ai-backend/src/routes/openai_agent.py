import os
import logging
from flask import Blueprint, request, jsonify
import openai

openai_bp = Blueprint('openai_bp', __name__)

# Configurar logging para arquivo e console
log_formatter = logging.Formatter('%(asctime)s %(levelname)s %(name)s: %(message)s')
file_handler = logging.FileHandler('system.log', encoding='utf-8')
file_handler.setLevel(logging.INFO)
file_handler.setFormatter(log_formatter)

console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(log_formatter)

logger = logging.getLogger("openai_agent")
logger.setLevel(logging.INFO)
if not logger.hasHandlers():
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)


# Nova forma de autenticação e uso do client OpenAI v1.x
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
client = openai.OpenAI(api_key=OPENAI_API_KEY)

@openai_bp.route('/api/ai/ask', methods=['POST'])
def ask_openai():
    data = request.get_json()
    prompt = data.get('prompt')
    logger.info(f"Recebida requisição para IA. Prompt: {prompt}")
    if not prompt:
        logger.warning("Prompt não fornecido na requisição.")
        return jsonify({'error': 'Prompt não fornecido'}), 400
    try:
        system_message = {
            "role": "system",
            "content": (
                "Você é um especialista em campanhas de marketing digital. "
                "Responda sempre com foco em estratégias, dicas, análise de resultados, sugestões de conteúdo, segmentação de público, otimização de campanhas e melhores práticas para anúncios em plataformas como Facebook, Instagram, WhatsApp, Google Ads e outras. Seja prático, objetivo e use linguagem acessível para profissionais de marketing e empreendedores."
            )
        }
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[system_message, {"role": "user", "content": prompt}]
        )
        answer = response.choices[0].message.content
        logger.info(f"Resposta da OpenAI: {answer}")
        return jsonify({'response': answer})
    except Exception as e:
        logger.error(f"Erro ao consultar OpenAI: {e}")
        return jsonify({'error': str(e)}), 500
