import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Settings, Play, Pause } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AutomationBuilder = () => {
    const { token } = useAuth();
    const [automation, setAutomation] = useState({
        name: '',
        trigger_type: 'keyword',
        trigger_config: { keywords: [], case_sensitive: false, exact_match: false },
        actions: [],
        is_active: true
    });
    const [templates, setTemplates] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchTemplates();
        fetchContacts();
    }, []);

    const fetchTemplates = async () => {
        try {
            const response = await fetch(`${VITE_API_URL}/api/templates`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setTemplates(data.templates);
            }
        } catch (error) {
            console.error('Erro ao buscar templates:', error);
        }
    };

    const fetchContacts = async () => {
        try {
            const response = await fetch(`${VITE_API_URL}/api/contacts`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setContacts(data.contacts);
                
                // Extrair tags únicas
                const tags = new Set();
                data.contacts.forEach(contact => {
                    if (contact.tags) {
                        contact.tags.forEach(tag => tags.add(tag));
                    }
                });
                setAvailableTags(Array.from(tags));
            }
        } catch (error) {
            console.error('Erro ao buscar contatos:', error);
        }
    };

    const addKeyword = (keyword) => {
        if (keyword && !automation.trigger_config.keywords.includes(keyword)) {
            setAutomation(prev => ({
                ...prev,
                trigger_config: {
                    ...prev.trigger_config,
                    keywords: [...prev.trigger_config.keywords, keyword]
                }
            }));
        }
    };

    const removeKeyword = (keywordToRemove) => {
        setAutomation(prev => ({
            ...prev,
            trigger_config: {
                ...prev.trigger_config,
                keywords: prev.trigger_config.keywords.filter(k => k !== keywordToRemove)
            }
        }));
    };

    const addAction = (actionType) => {
        const newAction = {
            id: Date.now(),
            type: actionType,
            ...(actionType === 'send_message' && { message: '', template_id: null, delay: 0 }),
            ...(actionType === 'add_tag' && { tag: '' }),
            ...(actionType === 'remove_tag' && { tag: '' }),
            ...(actionType === 'update_field' && { field: '', value: '' }),
            ...(actionType === 'delay' && { seconds: 60 })
        };
        
        setAutomation(prev => ({
            ...prev,
            actions: [...prev.actions, newAction]
        }));
    };

    const updateAction = (actionId, updates) => {
        setAutomation(prev => ({
            ...prev,
            actions: prev.actions.map(action => 
                action.id === actionId ? { ...action, ...updates } : action
            )
        }));
    };

    const removeAction = (actionId) => {
        setAutomation(prev => ({
            ...prev,
            actions: prev.actions.filter(action => action.id !== actionId)
        }));
    };

    const saveAutomation = async () => {
        setSaving(true);
        try {
            const response = await fetch(`${VITE_API_URL}/api/automations`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(automation)
            });
            
            if (response.ok) {
                alert('Automação criada com sucesso!');
                // Reset form
                setAutomation({
                    name: '',
                    trigger_type: 'keyword',
                    trigger_config: { keywords: [], case_sensitive: false, exact_match: false },
                    actions: [],
                    is_active: true
                });
            } else {
                const error = await response.json();
                alert(`Erro: ${error.error}`);
            }
        } catch (error) {
            alert(`Erro ao salvar: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const renderTriggerConfig = () => {
        switch (automation.trigger_type) {
            case 'keyword':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label>Palavras-chave</Label>
                            <div className="flex gap-2 mt-2">
                                <Input 
                                    placeholder="Digite uma palavra-chave e pressione Enter"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && e.target.value.trim()) {
                                            addKeyword(e.target.value.trim());
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {automation.trigger_config.keywords.map((keyword, idx) => (
                                    <Badge key={idx} variant="secondary" className="cursor-pointer">
                                        {keyword}
                                        <button 
                                            onClick={() => removeKeyword(keyword)}
                                            className="ml-2 hover:text-red-500"
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={automation.trigger_config.case_sensitive}
                                    onChange={(e) => setAutomation(prev => ({
                                        ...prev,
                                        trigger_config: {
                                            ...prev.trigger_config,
                                            case_sensitive: e.target.checked
                                        }
                                    }))}
                                />
                                <span>Sensível a maiúsculas</span>
                            </label>
                            
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={automation.trigger_config.exact_match}
                                    onChange={(e) => setAutomation(prev => ({
                                        ...prev,
                                        trigger_config: {
                                            ...prev.trigger_config,
                                            exact_match: e.target.checked
                                        }
                                    }))}
                                />
                                <span>Correspondência exata</span>
                            </label>
                        </div>
                    </div>
                );
            
            case 'schedule':
                return (
                    <div>
                        <Label>Configuração de Agendamento</Label>
                        <p className="text-sm text-gray-500 mt-1">
                            Funcionalidade em desenvolvimento
                        </p>
                    </div>
                );
            
            case 'webhook':
                return (
                    <div>
                        <Label>Configuração de Webhook</Label>
                        <p className="text-sm text-gray-500 mt-1">
                            Funcionalidade em desenvolvimento
                        </p>
                    </div>
                );
            
            default:
                return null;
        }
    };

    const renderAction = (action, index) => {
        switch (action.type) {
            case 'send_message':
                return (
                    <div key={action.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium">Enviar Mensagem</h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAction(action.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        
                        <div>
                            <Label>Template (opcional)</Label>
                            <Select
                                value={action.template_id || ''}
                                onValueChange={(value) => updateAction(action.id, { template_id: value || null })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um template" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Nenhum template</SelectItem>
                                    {templates.map(template => (
                                        <SelectItem key={template.id} value={template.id.toString()}>
                                            {template.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div>
                            <Label>Mensagem</Label>
                            <Textarea 
                                placeholder="Digite a mensagem... Use {{name}}, {{phone}}, {{email}} para personalizar"
                                value={action.message}
                                onChange={(e) => updateAction(action.id, { message: e.target.value })}
                                rows={4}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Variáveis disponíveis: {'{{name}}, {{phone}}, {{email}}'}
                            </p>
                        </div>
                        
                        <div>
                            <Label>Delay (segundos)</Label>
                            <Input
                                type="number"
                                min="0"
                                value={action.delay || 0}
                                onChange={(e) => updateAction(action.id, { delay: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                );
            
            case 'add_tag':
                return (
                    <div key={action.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium">Adicionar Tag</h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAction(action.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        
                        <div>
                            <Label>Tag</Label>
                            <Select
                                value={action.tag || ''}
                                onValueChange={(value) => updateAction(action.id, { tag: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione ou digite uma tag" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableTags.map(tag => (
                                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                className="mt-2"
                                placeholder="Ou digite uma nova tag"
                                value={action.tag || ''}
                                onChange={(e) => updateAction(action.id, { tag: e.target.value })}
                            />
                        </div>
                    </div>
                );
            
            case 'remove_tag':
                return (
                    <div key={action.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium">Remover Tag</h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAction(action.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        
                        <div>
                            <Label>Tag</Label>
                            <Select
                                value={action.tag || ''}
                                onValueChange={(value) => updateAction(action.id, { tag: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma tag" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableTags.map(tag => (
                                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                );
            
            case 'update_field':
                return (
                    <div key={action.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium">Atualizar Campo</h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAction(action.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Campo</Label>
                                <Input
                                    placeholder="Nome do campo"
                                    value={action.field || ''}
                                    onChange={(e) => updateAction(action.id, { field: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Valor</Label>
                                <Input
                                    placeholder="Valor do campo"
                                    value={action.value || ''}
                                    onChange={(e) => updateAction(action.id, { value: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                );
            
            case 'delay':
                return (
                    <div key={action.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium">Delay</h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAction(action.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        
                        <div>
                            <Label>Tempo (segundos)</Label>
                            <Input
                                type="number"
                                min="1"
                                value={action.seconds || 60}
                                onChange={(e) => updateAction(action.id, { seconds: parseInt(e.target.value) || 60 })}
                            />
                        </div>
                        
                        <p className="text-sm text-orange-600">
                            ⚠️ Todas as ações após este delay serão agendadas para execução posterior
                        </p>
                    </div>
                );
            
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Construtor de Automações
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Configurações Básicas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Nome da Automação</Label>
                            <Input 
                                value={automation.name}
                                onChange={(e) => setAutomation(prev => ({...prev, name: e.target.value}))}
                                placeholder="Ex: Boas-vindas para novos contatos"
                            />
                        </div>
                        
                        <div>
                            <Label>Tipo de Gatilho</Label>
                            <Select 
                                value={automation.trigger_type}
                                onValueChange={(value) => setAutomation(prev => ({
                                    ...prev, 
                                    trigger_type: value,
                                    trigger_config: value === 'keyword' 
                                        ? { keywords: [], case_sensitive: false, exact_match: false }
                                        : {}
                                }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="keyword">Palavra-chave</SelectItem>
                                    <SelectItem value="schedule">Agendamento</SelectItem>
                                    <SelectItem value="webhook">Webhook</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Configuração do Gatilho */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Configuração do Gatilho</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {renderTriggerConfig()}
                        </CardContent>
                    </Card>

                    {/* Ações */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex justify-between items-center">
                                Ações da Automação
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addAction('send_message')}
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Mensagem
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addAction('add_tag')}
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Tag
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addAction('delay')}
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Delay
                                    </Button>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {automation.actions.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">
                                    Nenhuma ação configurada. Clique nos botões acima para adicionar ações.
                                </p>
                            ) : (
                                automation.actions.map((action, index) => renderAction(action, index))
                            )}
                        </CardContent>
                    </Card>

                    {/* Status */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={automation.is_active}
                            onChange={(e) => setAutomation(prev => ({...prev, is_active: e.target.checked}))}
                        />
                        <Label htmlFor="is_active" className="flex items-center gap-2">
                            {automation.is_active ? (
                                <><Play className="w-4 h-4 text-green-500" /> Automação Ativa</>
                            ) : (
                                <><Pause className="w-4 h-4 text-gray-500" /> Automação Inativa</>
                            )}
                        </Label>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => setAutomation({
                                name: '',
                                trigger_type: 'keyword',
                                trigger_config: { keywords: [], case_sensitive: false, exact_match: false },
                                actions: [],
                                is_active: true
                            })}
                        >
                            Limpar
                        </Button>
                        <Button 
                            onClick={saveAutomation}
                            disabled={saving || !automation.name.trim()}
                        >
                            {saving ? 'Salvando...' : 'Salvar Automação'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AutomationBuilder;