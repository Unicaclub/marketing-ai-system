import json
import re
from datetime import datetime, timedelta
from src.models.automation import Automation, Contact, Message, MessageTemplate, AutomationMetrics, QueuedMessage
from src.models.db_instance import db
from sqlalchemy import func

class AutomationEngine:
    def __init__(self):
        self.triggers = {
            'keyword': self._handle_keyword_trigger,
            'schedule': self._handle_schedule_trigger,
            'webhook': self._handle_webhook_trigger
        }
        
    def process_incoming_message(self, user_id, phone, message_content, platform='whatsapp'):
        """Processa mensagem recebida e executa automações"""
        try:
            # Encontrar ou criar contato
            contact = Contact.query.filter_by(user_id=user_id, phone=phone).first()
            if not contact:
                contact = Contact(
                    user_id=user_id, 
                    phone=phone, 
                    last_interaction=datetime.utcnow(),
                    tags=[]
                )
                db.session.add(contact)
                db.session.flush()  # Para obter o ID do contato
            else:
                contact.last_interaction = datetime.utcnow()
            
            # Salvar mensagem recebida
            message = Message(
                user_id=user_id,
                contact_id=contact.id,
                message_type='text',
                content=message_content,
                direction='inbound',
                platform=platform
            )
            db.session.add(message)
            
            # Buscar automações ativas para este usuário
            automations = Automation.query.filter_by(user_id=user_id, is_active=True).all()
            
            # Processar triggers
            for automation in automations:
                if automation.trigger_type in self.triggers:
                    self.triggers[automation.trigger_type](automation, message_content, contact, platform)
                    
            db.session.commit()
            return True
            
        except Exception as e:
            db.session.rollback()
            print(f"Erro ao processar mensagem: {e}")
            return False
    
    def _handle_keyword_trigger(self, automation, message_content, contact, platform):
        """Verifica se mensagem contém palavra-chave"""
        config = automation.trigger_config or {}
        keywords = config.get('keywords', [])
        case_sensitive = config.get('case_sensitive', False)
        exact_match = config.get('exact_match', False)
        
        message_text = message_content if case_sensitive else message_content.lower()
        
        for keyword in keywords:
            keyword_text = keyword if case_sensitive else keyword.lower()
            
            if exact_match:
                if message_text.strip() == keyword_text:
                    self._execute_actions(automation, contact, platform)
                    self._update_metrics(automation.id)
                    break
            else:
                if keyword_text in message_text:
                    self._execute_actions(automation, contact, platform)
                    self._update_metrics(automation.id)
                    break
    
    def _handle_schedule_trigger(self, automation, message_content, contact, platform):
        """Triggers baseados em horário - processados separadamente"""
        # Este será chamado por um scheduler separado (cron job)
        pass
    
    def _handle_webhook_trigger(self, automation, message_content, contact, platform):
        """Triggers baseados em webhooks externos"""
        # Implementar lógica para webhooks específicos
        pass
    
    def _execute_actions(self, automation, contact, platform):
        """Executa ações da automação"""
        actions = automation.actions or []
        
        for i, action in enumerate(actions):
            action_type = action.get('type')
            
            if action_type == 'send_message':
                delay = action.get('delay', 0)
                if delay > 0:
                    # Agendar mensagem para envio posterior
                    self._schedule_message(action, contact, platform, automation.id, delay)
                else:
                    self._send_message_action(action, contact, platform, automation.id)
                    
            elif action_type == 'add_tag':
                self._add_tag_action(action, contact)
                
            elif action_type == 'remove_tag':
                self._remove_tag_action(action, contact)
                
            elif action_type == 'update_field':
                self._update_field_action(action, contact)
                
            elif action_type == 'delay':
                # Para próximas ações, agendar com delay
                remaining_actions = actions[i+1:]
                if remaining_actions:
                    delay_seconds = action.get('seconds', 0)
                    self._schedule_actions(remaining_actions, contact, platform, automation.id, delay_seconds)
                break
    
    def _send_message_action(self, action, contact, platform, automation_id=None):
        """Envia mensagem para contato"""
        message_text = action.get('message', '')
        template_id = action.get('template_id')
        
        if template_id:
            template = MessageTemplate.query.get(template_id)
            if template:
                message_text = template.content
        
        # Personalizar mensagem com dados do contato
        message_text = self._personalize_message(message_text, contact)
        
        # Salvar mensagem enviada
        message = Message(
            user_id=contact.user_id,
            contact_id=contact.id,
            automation_id=automation_id,
            message_type='text',
            content=message_text,
            direction='outbound',
            platform=platform
        )
        db.session.add(message)
        
        # Aqui você integraria com as APIs dos diferentes canais
        # self._send_to_platform(platform, contact.phone, message_text)
        
        return message
    
    def _personalize_message(self, message_text, contact):
        """Personaliza mensagem com dados do contato"""
        replacements = {
            '{{name}}': contact.name or 'Cliente',
            '{{phone}}': contact.phone,
            '{{email}}': contact.email or '',
        }
        
        # Adicionar campos personalizados
        if contact.custom_fields:
            for field, value in contact.custom_fields.items():
                replacements[f'{{{{{field}}}}}'] = str(value) if value else ''
        
        # Substituir variáveis na mensagem
        for placeholder, value in replacements.items():
            message_text = message_text.replace(placeholder, value)
        
        return message_text
    
    def _add_tag_action(self, action, contact):
        """Adiciona tag ao contato"""
        tag = action.get('tag', '')
        if tag and tag not in (contact.tags or []):
            tags = contact.tags or []
            tags.append(tag)
            contact.tags = tags
    
    def _remove_tag_action(self, action, contact):
        """Remove tag do contato"""
        tag = action.get('tag', '')
        if tag and contact.tags and tag in contact.tags:
            contact.tags.remove(tag)
    
    def _update_field_action(self, action, contact):
        """Atualiza campo personalizado do contato"""
        field = action.get('field', '')
        value = action.get('value', '')
        
        if field:
            custom_fields = contact.custom_fields or {}
            custom_fields[field] = value
            contact.custom_fields = custom_fields
    
    def _schedule_message(self, action, contact, platform, automation_id, delay_seconds):
        """Agenda mensagem para envio posterior"""
        scheduled_time = datetime.utcnow() + timedelta(seconds=delay_seconds)
        
        message_text = action.get('message', '')
        template_id = action.get('template_id')
        
        if template_id:
            template = MessageTemplate.query.get(template_id)
            if template:
                message_text = template.content
        
        message_text = self._personalize_message(message_text, contact)
        
        queued_message = QueuedMessage(
            user_id=contact.user_id,
            contact_id=contact.id,
            automation_id=automation_id,
            message_content=message_text,
            message_type='text',
            platform=platform,
            scheduled_time=scheduled_time
        )
        db.session.add(queued_message)
    
    def _update_metrics(self, automation_id):
        """Atualiza métricas da automação"""
        today = datetime.utcnow().date()
        
        metrics = AutomationMetrics.query.filter_by(
            automation_id=automation_id,
            date=today
        ).first()
        
        if not metrics:
            metrics = AutomationMetrics(
                automation_id=automation_id,
                date=today,
                triggers_count=1,
                messages_sent=0,
                unique_contacts=0
            )
            db.session.add(metrics)
        else:
            metrics.triggers_count += 1
    
    def process_queued_messages(self):
        """Processa mensagens agendadas - deve ser chamado por um scheduler"""
        current_time = datetime.utcnow()
        
        queued_messages = QueuedMessage.query.filter(
            QueuedMessage.scheduled_time <= current_time,
            QueuedMessage.status == 'pending'
        ).all()
        
        for queued_msg in queued_messages:
            try:
                # Marcar como processando
                queued_msg.status = 'processing'
                db.session.commit()
                
                # Enviar mensagem
                contact = Contact.query.get(queued_msg.contact_id)
                if contact:
                    message = Message(
                        user_id=queued_msg.user_id,
                        contact_id=queued_msg.contact_id,
                        automation_id=queued_msg.automation_id,
                        message_type=queued_msg.message_type,
                        content=queued_msg.message_content,
                        direction='outbound',
                        platform=queued_msg.platform
                    )
                    db.session.add(message)
                    
                    # Integrar com API do canal
                    # self._send_to_platform(queued_msg.platform, contact.phone, queued_msg.message_content)
                    
                    queued_msg.status = 'sent'
                else:
                    queued_msg.status = 'failed'
                    
                db.session.commit()
                
            except Exception as e:
                queued_msg.status = 'failed'
                db.session.commit()
                print(f"Erro ao processar mensagem agendada {queued_msg.id}: {e}")
    
    def get_contact_segments(self, user_id, tags=None, custom_filters=None):
        """Segmenta contatos baseado em tags e filtros personalizados"""
        query = Contact.query.filter_by(user_id=user_id)
        
        if tags:
            # Filtrar por tags
            for tag in tags:
                query = query.filter(Contact.tags.contains([tag]))
        
        if custom_filters:
            # Aplicar filtros personalizados
            for field, value in custom_filters.items():
                if field == 'last_interaction_days':
                    days_ago = datetime.utcnow() - timedelta(days=int(value))
                    query = query.filter(Contact.last_interaction >= days_ago)
                elif field == 'name_contains':
                    query = query.filter(Contact.name.ilike(f'%{value}%'))
        
        return query.all()
    
    def get_automation_analytics(self, automation_id, start_date=None, end_date=None):
        """Obtém analytics de uma automação"""
        query = AutomationMetrics.query.filter_by(automation_id=automation_id)
        
        if start_date:
            query = query.filter(AutomationMetrics.date >= start_date)
        if end_date:
            query = query.filter(AutomationMetrics.date <= end_date)
            
        metrics = query.all()
        
        total_triggers = sum(m.triggers_count for m in metrics)
        total_messages = sum(m.messages_sent for m in metrics)
        avg_conversion = sum(m.conversion_rate for m in metrics) / len(metrics) if metrics else 0
        
        return {
            'total_triggers': total_triggers,
            'total_messages': total_messages,
            'avg_conversion_rate': avg_conversion,
            'daily_metrics': [m.to_dict() for m in metrics]
        }