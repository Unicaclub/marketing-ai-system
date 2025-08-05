import schedule
import time
import threading
from datetime import datetime, timedelta
from src.services.automation_engine import AutomationEngine
from src.models.automation import QueuedMessage, AutomationMetrics
from src.models.db_instance import db
from src.models import create_app
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class QueueProcessor:
    def __init__(self):
        self.engine = AutomationEngine()
        self.app = create_app()
        self.running = False
        self.thread = None
        
    def start(self):
        """Inicia o processador de filas"""
        if self.running:
            return
            
        self.running = True
        
        # Agendar tarefas
        schedule.every(30).seconds.do(self._process_queued_messages)
        schedule.every(5).minutes.do(self._process_scheduled_automations)
        schedule.every().hour.do(self._update_metrics)
        schedule.every().day.at("00:00").do(self._cleanup_old_data)
        
        # Iniciar thread
        self.thread = threading.Thread(target=self._run_scheduler, daemon=True)
        self.thread.start()
        
        logger.info("Queue Processor iniciado")
    
    def stop(self):
        """Para o processador de filas"""
        self.running = False
        if self.thread:
            self.thread.join()
        logger.info("Queue Processor parado")
    
    def _run_scheduler(self):
        """Executa o scheduler em loop"""
        while self.running:
            try:
                schedule.run_pending()
                time.sleep(1)
            except Exception as e:
                logger.error(f"Erro no scheduler: {e}")
                time.sleep(10)  # Aguardar antes de tentar novamente
    
    def _process_queued_messages(self):
        """Processa mensagens agendadas"""
        with self.app.app_context():
            try:
                current_time = datetime.utcnow()
                
                # Buscar mensagens pendentes que devem ser enviadas
                queued_messages = QueuedMessage.query.filter(
                    QueuedMessage.scheduled_time <= current_time,
                    QueuedMessage.status == 'pending'
                ).limit(50).all()  # Processar em lotes
                
                processed_count = 0
                
                for queued_msg in queued_messages:
                    try:
                        # Marcar como processando
                        queued_msg.status = 'processing'
                        db.session.commit()
                        
                        # Processar mensagem
                        success = self._send_queued_message(queued_msg)
                        
                        if success:
                            queued_msg.status = 'sent'
                            processed_count += 1
                        else:
                            queued_msg.status = 'failed'
                            
                        db.session.commit()
                        
                    except Exception as e:
                        logger.error(f"Erro ao processar mensagem {queued_msg.id}: {e}")
                        queued_msg.status = 'failed'
                        db.session.commit()
                
                if processed_count > 0:
                    logger.info(f"Processadas {processed_count} mensagens agendadas")
                    
            except Exception as e:
                logger.error(f"Erro ao processar fila de mensagens: {e}")
                db.session.rollback()
    
    def _send_queued_message(self, queued_msg):
        """Envia uma mensagem agendada"""
        try:
            from src.models.automation import Contact, Message
            
            # Buscar contato
            contact = Contact.query.get(queued_msg.contact_id)
            if not contact:
                logger.error(f"Contato {queued_msg.contact_id} não encontrado")
                return False
            
            # Criar registro da mensagem
            message = Message(
                user_id=queued_msg.user_id,
                contact_id=queued_msg.contact_id,
                automation_id=queued_msg.automation_id,
                message_type=queued_msg.message_type,
                content=queued_msg.message_content,
                direction='outbound',
                platform=queued_msg.platform,
                status='sent'
            )
            
            db.session.add(message)
            
            # Aqui você integraria com as APIs dos diferentes canais
            success = self._send_to_platform(
                queued_msg.platform, 
                contact.phone, 
                queued_msg.message_content
            )
            
            if success:
                # Atualizar última interação do contato
                contact.last_interaction = datetime.utcnow()
                
                # Atualizar métricas
                self._increment_message_metrics(queued_msg.automation_id)
                
            return success
            
        except Exception as e:
            logger.error(f"Erro ao enviar mensagem agendada: {e}")
            return False
    
    def _send_to_platform(self, platform, phone, content):
        """Integração com APIs das plataformas"""
        try:
            if platform == 'whatsapp':
                return self._send_whatsapp(phone, content)
            elif platform == 'telegram':
                return self._send_telegram(phone, content)
            elif platform == 'instagram':
                return self._send_instagram(phone, content)
            else:
                logger.error(f"Plataforma não suportada: {platform}")
                return False
        except Exception as e:
            logger.error(f"Erro ao enviar para {platform}: {e}")
            return False
    
    def _send_whatsapp(self, phone, content):
        """Enviar mensagem via WhatsApp (Z-API ou similar)"""
        # Implementar integração com Z-API
        # Exemplo:
        # import requests
        # 
        # url = "https://api.z-api.io/instances/YOUR_INSTANCE/token/YOUR_TOKEN/send-text"
        # payload = {
        #     "phone": phone,
        #     "message": content
        # }
        # response = requests.post(url, json=payload)
        # return response.status_code == 200
        
        # Por enquanto, simular envio bem-sucedido
        logger.info(f"[SIMULADO] WhatsApp enviado para {phone}: {content[:50]}...")
        return True
    
    def _send_telegram(self, phone, content):
        """Enviar mensagem via Telegram"""
        # Implementar integração com Telegram Bot API
        logger.info(f"[SIMULADO] Telegram enviado para {phone}: {content[:50]}...")
        return True
    
    def _send_instagram(self, phone, content):
        """Enviar mensagem via Instagram"""
        # Implementar integração com Instagram API
        logger.info(f"[SIMULADO] Instagram enviado para {phone}: {content[:50]}...")
        return True
    
    def _process_scheduled_automations(self):
        """Processa automações agendadas (cron-like)"""
        with self.app.app_context():
            try:
                from src.models.automation import Automation
                
                # Buscar automações com triggers de agendamento
                scheduled_automations = Automation.query.filter_by(
                    trigger_type='schedule',
                    is_active=True
                ).all()
                
                current_time = datetime.utcnow()
                
                for automation in scheduled_automations:
                    config = automation.trigger_config or {}
                    
                    if self._should_trigger_scheduled_automation(config, current_time):
                        self._execute_scheduled_automation(automation)
                        
            except Exception as e:
                logger.error(f"Erro ao processar automações agendadas: {e}")
    
    def _should_trigger_scheduled_automation(self, config, current_time):
        """Verifica se uma automação agendada deve ser executada"""
        trigger_type = config.get('schedule_type')  # 'daily', 'weekly', 'monthly'
        trigger_time = config.get('time')  # "14:30"
        trigger_days = config.get('days', [])  # [1, 2, 3] para seg, ter, qua
        
        if not trigger_type or not trigger_time:
            return False
        
        try:
            # Verificar se já foi executada hoje
            last_execution = config.get('last_execution')
            if last_execution:
                last_exec_date = datetime.fromisoformat(last_execution).date()
                if last_exec_date == current_time.date():
                    return False  # Já executada hoje
            
            # Verificar horário
            trigger_hour, trigger_minute = map(int, trigger_time.split(':'))
            
            if trigger_type == 'daily':
                return (current_time.hour == trigger_hour and 
                       current_time.minute == trigger_minute)
            
            elif trigger_type == 'weekly':
                weekday = current_time.weekday() + 1  # 1=segunda, 7=domingo
                return (weekday in trigger_days and
                       current_time.hour == trigger_hour and 
                       current_time.minute == trigger_minute)
            
            # Adicionar mais tipos conforme necessário
            
        except Exception as e:
            logger.error(f"Erro ao verificar trigger agendado: {e}")
            
        return False
    
    def _execute_scheduled_automation(self, automation):
        """Executa uma automação agendada"""
        try:
            from src.models.automation import Contact
            
            # Buscar contatos do usuário
            contacts = Contact.query.filter_by(user_id=automation.user_id).all()
            
            for contact in contacts:
                # Executar ações da automação para cada contato
                self.engine._execute_actions(automation, contact, 'whatsapp')
            
            # Atualizar última execução
            config = automation.trigger_config or {}
            config['last_execution'] = datetime.utcnow().isoformat()
            automation.trigger_config = config
            
            db.session.commit()
            
            logger.info(f"Automação agendada {automation.id} executada para {len(contacts)} contatos")
            
        except Exception as e:
            logger.error(f"Erro ao executar automação agendada {automation.id}: {e}")
            db.session.rollback()
    
    def _increment_message_metrics(self, automation_id):
        """Incrementa métricas de mensagens enviadas"""
        if not automation_id:
            return
            
        try:
            today = datetime.utcnow().date()
            
            metrics = AutomationMetrics.query.filter_by(
                automation_id=automation_id,
                date=today
            ).first()
            
            if metrics:
                metrics.messages_sent += 1
            else:
                metrics = AutomationMetrics(
                    automation_id=automation_id,
                    date=today,
                    messages_sent=1
                )
                db.session.add(metrics)
                
            db.session.commit()
            
        except Exception as e:
            logger.error(f"Erro ao atualizar métricas: {e}")
            db.session.rollback()
    
    def _update_metrics(self):
        """Atualiza métricas gerais"""
        with self.app.app_context():
            try:
                # Implementar cálculo de métricas agregadas
                # Por exemplo: taxa de conversão, engajamento, etc.
                logger.info("Métricas atualizadas")
                
            except Exception as e:
                logger.error(f"Erro ao atualizar métricas: {e}")
    
    def _cleanup_old_data(self):
        """Limpa dados antigos"""
        with self.app.app_context():
            try:
                # Remover mensagens agendadas antigas (mais de 30 dias)
                cutoff_date = datetime.utcnow() - timedelta(days=30)
                
                old_queued = QueuedMessage.query.filter(
                    QueuedMessage.created_at < cutoff_date,
                    QueuedMessage.status.in_(['sent', 'failed'])
                ).delete()
                
                db.session.commit()
                
                if old_queued > 0:
                    logger.info(f"Removidas {old_queued} mensagens agendadas antigas")
                    
            except Exception as e:
                logger.error(f"Erro na limpeza de dados: {e}")
                db.session.rollback()

# Instância global do processador
queue_processor = QueueProcessor()

def start_queue_processor():
    """Função para iniciar o processador de filas"""
    queue_processor.start()

def stop_queue_processor():
    """Função para parar o processador de filas"""
    queue_processor.stop()

if __name__ == "__main__":
    # Para executar standalone
    try:
        queue_processor.start()
        logger.info("Queue Processor rodando... Pressione Ctrl+C para parar")
        
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        logger.info("Parando Queue Processor...")
        queue_processor.stop()