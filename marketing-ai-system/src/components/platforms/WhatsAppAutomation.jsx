import React, { useState } from 'react';
import {
  Send, Phone, Upload, Zap, Users, MapPin
} from 'lucide-react';

const WhatsAppAutomation = () => {
  const [sessionPhone, setSessionPhone] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [destPhone, setDestPhone] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [stickerUrl, setStickerUrl] = useState('');
  const [contactJson, setContactJson] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationDesc, setLocationDesc] = useState('');
  const [result, setResult] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  const handleStartSession = async () => {
    if (!sessionPhone) {
      setResult('Informe o número do WhatsApp para iniciar a sessão.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/whatsapp/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: sessionPhone })
      });
      const data = await res.json();
      setResult(res.ok ? 'Sessão iniciada: ' + JSON.stringify(data) : 'Erro: ' + (data.details || res.status));
    } catch (err) {
      setResult('Erro ao conectar: ' + err.message);
    }
  };

  const handleSendMessage = async () => {
    if (!sessionId || !destPhone || !message) {
      setResult('Preencha todos os campos para enviar mensagem.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: sessionId, phone: destPhone, message })
      });
      const data = await res.json();
      setResult(res.ok ? 'Mensagem enviada: ' + JSON.stringify(data) : 'Erro: ' + (data.details || res.status));
    } catch (err) {
      setResult('Erro ao conectar: ' + err.message);
    }
  };

  const handleSendImage = async () => {
    if (!sessionId || !destPhone || !imageUrl) {
      setResult('Preencha todos os campos para enviar imagem.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/whatsapp/send-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: sessionId, phone: destPhone, image: imageUrl, caption: imageCaption })
      });
      const data = await res.json();
      setResult(res.ok ? 'Imagem enviada: ' + JSON.stringify(data) : 'Erro: ' + (data.details || res.status));
    } catch (err) {
      setResult('Erro ao conectar: ' + err.message);
    }
  };

  const handleSendFile = async () => {
    if (!sessionId || !destPhone || !fileUrl || !fileName) {
      setResult('Preencha todos os campos para enviar arquivo.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/whatsapp/send-file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: sessionId, phone: destPhone, file: fileUrl, filename: fileName })
      });
      const data = await res.json();
      setResult(res.ok ? 'Arquivo enviado: ' + JSON.stringify(data) : 'Erro: ' + (data.details || res.status));
    } catch (err) {
      setResult('Erro ao conectar: ' + err.message);
    }
  };

  const handleSendSticker = async () => {
    if (!sessionId || !destPhone || !stickerUrl) {
      setResult('Preencha todos os campos para enviar sticker.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/whatsapp/send-sticker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: sessionId, phone: destPhone, sticker: stickerUrl })
      });
      const data = await res.json();
      setResult(res.ok ? 'Sticker enviado: ' + JSON.stringify(data) : 'Erro: ' + (data.details || res.status));
    } catch (err) {
      setResult('Erro ao conectar: ' + err.message);
    }
  };

  const handleSendContact = async () => {
    if (!sessionId || !destPhone || !contactJson) {
      setResult('Preencha todos os campos para enviar contato.');
      return;
    }
    let contact;
    try {
      contact = JSON.parse(contactJson);
    } catch {
      setResult('Contato deve ser um JSON válido.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/whatsapp/send-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: sessionId, phone: destPhone, contact })
      });
      const data = await res.json();
      setResult(res.ok ? 'Contato enviado: ' + JSON.stringify(data) : 'Erro: ' + (data.details || res.status));
    } catch (err) {
      setResult('Erro ao conectar: ' + err.message);
    }
  };

  const handleSendLocation = async () => {
    if (!sessionId || !destPhone || !latitude || !longitude) {
      setResult('Preencha todos os campos para enviar localização.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/whatsapp/send-location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: sessionId, phone: destPhone, latitude, longitude, description: locationDesc })
      });
      const data = await res.json();
      setResult(res.ok ? 'Localização enviada: ' + JSON.stringify(data) : 'Erro: ' + (data.details || res.status));
    } catch (err) {
      setResult('Erro ao conectar: ' + err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl border border-gray-200 mt-8">
      <h2 className="text-2xl font-bold mb-6">Automação WhatsApp (WhatsApi)</h2>
      <div className="space-y-6">
        {/* Iniciar Sessão */}
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Número do WhatsApp para Sessão</label>
            <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Ex: 5511999999999" value={sessionPhone} onChange={e => setSessionPhone(e.target.value)} />
          </div>
          <button onClick={handleStartSession} className="flex items-center gap-2 px-4 py-2 border border-green-400 text-green-700 rounded hover:bg-green-50">
            <Phone className="w-4 h-4" /> Iniciar Sessão
          </button>
        </div>
        {/* Informar ID da Sessão */}
        <div>
          <label className="block text-sm font-medium mb-1">ID da Sessão</label>
          <input type="text" className="w-full px-3 py-2 border rounded" placeholder="ID retornado ao iniciar sessão" value={sessionId} onChange={e => setSessionId(e.target.value)} />
        </div>
        {/* Informar número destinatário */}
        <div>
          <label className="block text-sm font-medium mb-1">Número do Destinatário</label>
          <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Ex: 5511999999999" value={destPhone} onChange={e => setDestPhone(e.target.value)} />
        </div>
        {/* Mensagem */}
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Mensagem</label>
            <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Digite a mensagem" value={message} onChange={e => setMessage(e.target.value)} />
          </div>
          <button onClick={handleSendMessage} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-blue-700">
            <Send className="w-4 h-4" /> Enviar Mensagem
          </button>
        </div>
        {/* Imagem */}
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">URL da Imagem</label>
            <input type="text" className="w-full px-3 py-2 border rounded" placeholder="https://..." value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Legenda (opcional)</label>
            <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Legenda" value={imageCaption} onChange={e => setImageCaption(e.target.value)} />
          </div>
          <button onClick={handleSendImage} className="flex items-center gap-2 px-4 py-2 border border-blue-400 text-blue-700 rounded hover:bg-blue-50">
            <Upload className="w-4 h-4" /> Enviar Imagem
          </button>
        </div>
        {/* Arquivo */}
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">URL do Arquivo</label>
            <input type="text" className="w-full px-3 py-2 border rounded" placeholder="https://..." value={fileUrl} onChange={e => setFileUrl(e.target.value)} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Nome do Arquivo</label>
            <input type="text" className="w-full px-3 py-2 border rounded" placeholder="arquivo.pdf" value={fileName} onChange={e => setFileName(e.target.value)} />
          </div>
          <button onClick={handleSendFile} className="flex items-center gap-2 px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-50">
            <Upload className="w-4 h-4" /> Enviar Arquivo
          </button>
        </div>
        {/* Sticker */}
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">URL do Sticker</label>
            <input type="text" className="w-full px-3 py-2 border rounded" placeholder="https://..." value={stickerUrl} onChange={e => setStickerUrl(e.target.value)} />
          </div>
          <button onClick={handleSendSticker} className="flex items-center gap-2 px-4 py-2 border border-yellow-400 text-yellow-700 rounded hover:bg-yellow-50">
            <Zap className="w-4 h-4" /> Enviar Sticker
          </button>
        </div>
        {/* Contato */}
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Contato (JSON)</label>
            <input type="text" className="w-full px-3 py-2 border rounded" placeholder='{"name":"João","phone":"5511999999999"}' value={contactJson} onChange={e => setContactJson(e.target.value)} />
          </div>
          <button onClick={handleSendContact} className="flex items-center gap-2 px-4 py-2 border border-purple-400 text-purple-700 rounded hover:bg-purple-50">
            <Users className="w-4 h-4" /> Enviar Contato
          </button>
        </div>
        {/* Localização */}
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input type="text" className="w-full px-3 py-2 border rounded" placeholder="-23.5" value={latitude} onChange={e => setLatitude(e.target.value)} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input type="text" className="w-full px-3 py-2 border rounded" placeholder="-46.6" value={longitude} onChange={e => setLongitude(e.target.value)} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Descrição (opcional)</label>
            <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Descrição" value={locationDesc} onChange={e => setLocationDesc(e.target.value)} />
          </div>
          <button onClick={handleSendLocation} className="flex items-center gap-2 px-4 py-2 border border-orange-400 text-orange-700 rounded hover:bg-orange-50">
            <MapPin className="w-4 h-4" /> Enviar Localização
          </button>
        </div>
        {/* Resultado */}
        {result && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-800 border border-gray-200">{result}</div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppAutomation;
