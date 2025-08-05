#!/usr/bin/env python3
"""
Script para iniciar o processador de filas de automação
Deve ser executado como um processo separado do servidor principal
"""

import os
import sys
import signal
import logging
from datetime import datetime

# Adicionar o diretório raiz ao path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, os.path.dirname(__file__))

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    handlers=[
        logging.FileHandler('queue_processor.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def signal_handler(signum, frame):
    """Handler para sinais de interrupção"""
    logger.info(f"Recebido sinal {signum}, parando o processador...")
    from src.services.queue_processor import stop_queue_processor
    stop_queue_processor()
    sys.exit(0)

def main():
    """Função principal"""
    try:
        logger.info("=== Iniciando Queue Processor ===")
        logger.info(f"Timestamp: {datetime.now()}")
        logger.info(f"Python version: {sys.version}")
        logger.info(f"Working directory: {os.getcwd()}")
        
        # Registrar handlers de sinal
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)
        
        # Importar e iniciar o processador
        from src.services.queue_processor import start_queue_processor
        start_queue_processor()
        
        logger.info("Queue Processor iniciado com sucesso!")
        logger.info("Pressione Ctrl+C para parar...")
        
        # Manter o processo rodando
        import time
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        logger.info("Interrompido pelo usuário")
    except Exception as e:
        logger.error(f"Erro fatal no Queue Processor: {e}")
        import traceback
        logger.error(traceback.format_exc())
        sys.exit(1)
    finally:
        logger.info("Queue Processor finalizado")

if __name__ == "__main__":
    main()