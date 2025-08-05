import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
    Users, Filter, Plus, Edit, Trash2, Send, Download, 
    Calendar, Tag, Search, UserCheck, MessageSquare 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ContactSegmentation = () => {
    const { token } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [segments, setSegments] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContacts, setSelectedContacts] = useState([]);
    
    // Filtros
    const [filters, setFilters] = useState({
        tags: [],
        lastInteractionDays: '',
        nameContains: '',
        customFields: {}
    });
    
    // Segmento sendo criado/editado
    const [currentSegment, setCurrentSegment] = useState({
        name: '',
        description: '',
        filters: {
            tags: [],
            lastInteractionDays: '',
            nameContains: '',
            customFields: {}
        }
    });
    const [isSegmentDialogOpen, setIsSegmentDialogOpen] = useState(false);
    const [editingSegment, setEditingSegment] = useState(null);

    // Estados para ações em massa
    const [massActionType, setMassActionType] = useState('');
    const [massActionData, setMassActionData] = useState({
        tag: '',
        message: '',
        field: '',
        value: ''
    });

    useEffect(() => {
        fetchContacts();
        fetchSegments();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [contacts, filters]);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${VITE_API_URL}/api/contacts?per_page=1000`, {
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
        } finally {
            setLoading(false);
        }
    };

    const fetchSegments = async () => {
        // Por enquanto, usar dados locais. Em produção, buscar do backend
        const savedSegments = JSON.parse(localStorage.getItem('contact_segments') || '[]');
        setSegments(savedSegments);
    };

    const applyFilters = () => {
        let filtered = [...contacts];

        // Filtrar por tags
        if (filters.tags.length > 0) {
            filtered = filtered.filter(contact => 
                filters.tags.some(tag => contact.tags?.includes(tag))
            );
        }

        // Filtrar por última interação
        if (filters.lastInteractionDays) {
            const daysAgo = new Date();
            daysAgo.setDate(daysAgo.getDate() - parseInt(filters.lastInteractionDays));
            
            filtered = filtered.filter(contact => {
                if (!contact.last_interaction) return false;
                return new Date(contact.last_interaction) >= daysAgo;
            });
        }

        // Filtrar por nome
        if (filters.nameContains) {
            filtered = filtered.filter(contact => 
                contact.name?.toLowerCase().includes(filters.nameContains.toLowerCase())
            );
        }

        // Filtrar por campos personalizados
        Object.entries(filters.customFields).forEach(([field, value]) => {
            if (value) {
                filtered = filtered.filter(contact => 
                    contact.custom_fields?.[field]?.toString().toLowerCase().includes(value.toLowerCase())
                );
            }
        });

        setFilteredContacts(filtered);
    };

    const getSegmentContacts = async (segmentFilters) => {
        try {
            const response = await fetch(`${VITE_API_URL}/api/contacts/segments`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tags: segmentFilters.tags,
                    filters: {
                        last_interaction_days: segmentFilters.lastInteractionDays,
                        name_contains: segmentFilters.nameContains,
                        ...segmentFilters.customFields
                    }
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.contacts;
            }
        } catch (error) {
            console.error('Erro ao buscar contatos do segmento:', error);
        }
        return [];
    };

    const saveSegment = async () => {
        try {
            const segmentContacts = await getSegmentContacts(currentSegment.filters);
            
            const segment = {
                id: editingSegment ? editingSegment.id : Date.now(),
                ...currentSegment,
                contactCount: segmentContacts.length,
                createdAt: editingSegment ? editingSegment.createdAt : new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            let updatedSegments;
            if (editingSegment) {
                updatedSegments = segments.map(s => s.id === editingSegment.id ? segment : s);
            } else {
                updatedSegments = [...segments, segment];
            }

            setSegments(updatedSegments);
            localStorage.setItem('contact_segments', JSON.stringify(updatedSegments));
            
            resetSegmentForm();
            setIsSegmentDialogOpen(false);
        } catch (error) {
            alert(`Erro ao salvar segmento: ${error.message}`);
        }
    };

    const deleteSegment = (segmentId) => {
        if (!confirm('Tem certeza que deseja excluir este segmento?')) return;

        const updatedSegments = segments.filter(s => s.id !== segmentId);
        setSegments(updatedSegments);
        localStorage.setItem('contact_segments', JSON.stringify(updatedSegments));
    };

    const resetSegmentForm = () => {
        setCurrentSegment({
            name: '',
            description: '',
            filters: {
                tags: [],
                lastInteractionDays: '',
                nameContains: '',
                customFields: {}
            }
        });
        setEditingSegment(null);
    };

    const loadSegmentAsFilter = async (segment) => {
        setFilters(segment.filters);
        
        // Buscar contatos do segmento
        const segmentContacts = await getSegmentContacts(segment.filters);
        setFilteredContacts(segmentContacts);
    };

    const handleContactSelection = (contactId, isSelected) => {
        if (isSelected) {
            setSelectedContacts([...selectedContacts, contactId]);
        } else {
            setSelectedContacts(selectedContacts.filter(id => id !== contactId));
        }
    };

    const selectAllContacts = () => {
        if (selectedContacts.length === filteredContacts.length) {
            setSelectedContacts([]);
        } else {
            setSelectedContacts(filteredContacts.map(c => c.id));
        }
    };

    const executeMassAction = async () => {
        if (selectedContacts.length === 0) {
            alert('Selecione pelo menos um contato');
            return;
        }

        try {
            const promises = selectedContacts.map(contactId => {
                const contact = contacts.find(c => c.id === contactId);
                if (!contact) return Promise.resolve();

                if (massActionType === 'add_tag') {
                    return updateContact(contactId, {
                        tags: [...(contact.tags || []), massActionData.tag].filter((tag, index, arr) => arr.indexOf(tag) === index)
                    });
                } else if (massActionType === 'remove_tag') {
                    return updateContact(contactId, {
                        tags: (contact.tags || []).filter(tag => tag !== massActionData.tag)
                    });
                } else if (massActionType === 'update_field') {
                    return updateContact(contactId, {
                        custom_fields: {
                            ...(contact.custom_fields || {}),
                            [massActionData.field]: massActionData.value
                        }
                    });
                } else if (massActionType === 'send_message') {
                    return sendMessageToContact(contactId, massActionData.message);
                }
            });

            await Promise.all(promises);
            
            // Recarregar contatos
            await fetchContacts();
            setSelectedContacts([]);
            setMassActionType('');
            setMassActionData({ tag: '', message: '', field: '', value: '' });
            
            alert('Ação executada com sucesso!');
        } catch (error) {
            alert(`Erro ao executar ação: ${error.message}`);
        }
    };

    const updateContact = async (contactId, updates) => {
        const response = await fetch(`${VITE_API_URL}/api/contacts/${contactId}`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar contato');
        }
    };

    const sendMessageToContact = async (contactId, message) => {
        const response = await fetch(`${VITE_API_URL}/api/messages/send`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contact_id: contactId,
                content: message,
                message_type: 'text',
                platform: 'whatsapp'
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar mensagem');
        }
    };

    const exportContacts = () => {
        const dataToExport = filteredContacts.map(contact => ({
            nome: contact.name || '',
            telefone: contact.phone,
            email: contact.email || '',
            tags: (contact.tags || []).join(', '),
            ultima_interacao: contact.last_interaction ? new Date(contact.last_interaction).toLocaleDateString('pt-BR') : '',
            ...contact.custom_fields
        }));

        const csv = [
            Object.keys(dataToExport[0] || {}).join(','),
            ...dataToExport.map(row => Object.values(row).map(value => `"${value}"`).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `contatos_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Segmentação de Contatos</h1>
                    <p className="text-gray-600">Organize e segmente seus contatos para campanhas direcionadas</p>
                </div>
                
                <div className="flex gap-2">
                    <Button variant="outline" onClick={exportContacts}>
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                    </Button>
                    
                    <Dialog open={isSegmentDialogOpen} onOpenChange={setIsSegmentDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={resetSegmentForm}>
                                <Plus className="w-4 h-4 mr-2" />
                                Novo Segmento
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingSegment ? 'Editar Segmento' : 'Criar Novo Segmento'}
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Nome do Segmento</Label>
                                        <Input
                                            value={currentSegment.name}
                                            onChange={(e) => setCurrentSegment(prev => ({...prev, name: e.target.value}))}
                                            placeholder="Ex: Clientes VIP"
                                        />
                                    </div>
                                    <div>
                                        <Label>Descrição</Label>
                                        <Input
                                            value={currentSegment.description}
                                            onChange={(e) => setCurrentSegment(prev => ({...prev, description: e.target.value}))}
                                            placeholder="Breve descrição do segmento"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label>Tags</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {availableTags.map(tag => (
                                            <Badge
                                                key={tag}
                                                variant={currentSegment.filters.tags.includes(tag) ? "default" : "outline"}
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    const tags = currentSegment.filters.tags.includes(tag)
                                                        ? currentSegment.filters.tags.filter(t => t !== tag)
                                                        : [...currentSegment.filters.tags, tag];
                                                    setCurrentSegment(prev => ({
                                                        ...prev,
                                                        filters: { ...prev.filters, tags }
                                                    }));
                                                }}
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Última interação (dias)</Label>
                                        <Input
                                            type="number"
                                            value={currentSegment.filters.lastInteractionDays}
                                            onChange={(e) => setCurrentSegment(prev => ({
                                                ...prev,
                                                filters: { ...prev.filters, lastInteractionDays: e.target.value }
                                            }))}
                                            placeholder="Ex: 30"
                                        />
                                    </div>
                                    <div>
                                        <Label>Nome contém</Label>
                                        <Input
                                            value={currentSegment.filters.nameContains}
                                            onChange={(e) => setCurrentSegment(prev => ({
                                                ...prev,
                                                filters: { ...prev.filters, nameContains: e.target.value }
                                            }))}
                                            placeholder="Filtrar por nome"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setIsSegmentDialogOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button onClick={saveSegment} disabled={!currentSegment.name.trim()}>
                                        {editingSegment ? 'Atualizar' : 'Salvar'} Segmento
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs defaultValue="segments" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="segments">Segmentos Salvos</TabsTrigger>
                    <TabsTrigger value="filter">Filtrar Contatos</TabsTrigger>
                    <TabsTrigger value="actions">Ações em Massa</TabsTrigger>
                </TabsList>

                <TabsContent value="segments">
                    {segments.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-8">
                                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Nenhum segmento criado ainda</p>
                                <p className="text-sm text-gray-400">Crie segmentos para organizar seus contatos</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {segments.map(segment => (
                                <Card key={segment.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">{segment.name}</CardTitle>
                                                {segment.description && (
                                                    <p className="text-sm text-gray-600 mt-1">{segment.description}</p>
                                                )}
                                            </div>
                                            
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setEditingSegment(segment);
                                                        setCurrentSegment({
                                                            name: segment.name,
                                                            description: segment.description || '',
                                                            filters: segment.filters
                                                        });
                                                        setIsSegmentDialogOpen(true);
                                                    }}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deleteSegment(segment.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Contatos:</span>
                                                <Badge variant="secondary">{segment.contactCount || 0}</Badge>
                                            </div>
                                            
                                            {segment.filters.tags.length > 0 && (
                                                <div>
                                                    <span className="text-sm text-gray-600">Tags:</span>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {segment.filters.tags.slice(0, 3).map(tag => (
                                                            <Badge key={tag} variant="outline" className="text-xs">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                        {segment.filters.tags.length > 3 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{segment.filters.tags.length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <Button
                                                className="w-full mt-4"
                                                variant="outline"
                                                onClick={() => loadSegmentAsFilter(segment)}
                                            >
                                                <Filter className="w-4 h-4 mr-2" />
                                                Ver Contatos
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="filter" className="space-y-6">
                    {/* Filtros */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="w-5 h-5" />
                                Filtros
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Tags</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {availableTags.map(tag => (
                                        <Badge
                                            key={tag}
                                            variant={filters.tags.includes(tag) ? "default" : "outline"}
                                            className="cursor-pointer"
                                            onClick={() => {
                                                const tags = filters.tags.includes(tag)
                                                    ? filters.tags.filter(t => t !== tag)
                                                    : [...filters.tags, tag];
                                                setFilters(prev => ({ ...prev, tags }));
                                            }}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Última interação (dias)</Label>
                                    <Input
                                        type="number"
                                        value={filters.lastInteractionDays}
                                        onChange={(e) => setFilters(prev => ({ 
                                            ...prev, 
                                            lastInteractionDays: e.target.value 
                                        }))}
                                        placeholder="Ex: 30"
                                    />
                                </div>
                                <div>
                                    <Label>Nome contém</Label>
                                    <Input
                                        value={filters.nameContains}
                                        onChange={(e) => setFilters(prev => ({ 
                                            ...prev, 
                                            nameContains: e.target.value 
                                        }))}
                                        placeholder="Filtrar por nome"
                                    />
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => setFilters({
                                    tags: [],
                                    lastInteractionDays: '',
                                    nameContains: '',
                                    customFields: {}
                                })}
                            >
                                Limpar Filtros
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Lista de Contatos */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Contatos ({filteredContacts.length})
                                </CardTitle>
                                
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                                        onCheckedChange={selectAllContacts}
                                    />
                                    <span className="text-sm">Selecionar todos</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-8">Carregando contatos...</div>
                            ) : filteredContacts.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    Nenhum contato encontrado com os filtros aplicados
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredContacts.slice(0, 100).map(contact => (
                                        <div key={contact.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                                            <Checkbox
                                                checked={selectedContacts.includes(contact.id)}
                                                onCheckedChange={(checked) => handleContactSelection(contact.id, checked)}
                                            />
                                            
                                            <div className="flex-1">
                                                <div className="font-medium">{contact.name || 'Sem nome'}</div>
                                                <div className="text-sm text-gray-600">{contact.phone}</div>
                                                {contact.tags && contact.tags.length > 0 && (
                                                    <div className="flex gap-1 mt-1">
                                                        {contact.tags.slice(0, 3).map(tag => (
                                                            <Badge key={tag} variant="outline" className="text-xs">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="text-sm text-gray-500">
                                                {contact.last_interaction && 
                                                    new Date(contact.last_interaction).toLocaleDateString('pt-BR')
                                                }
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {filteredContacts.length > 100 && (
                                        <div className="text-center py-4 text-gray-500">
                                            Mostrando primeiros 100 contatos de {filteredContacts.length}
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="actions" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ações em Massa</CardTitle>
                            <p className="text-sm text-gray-600">
                                {selectedContacts.length} contato(s) selecionado(s)
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Tipo de Ação</Label>
                                <Select value={massActionType} onValueChange={setMassActionType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma ação" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="add_tag">Adicionar Tag</SelectItem>
                                        <SelectItem value="remove_tag">Remover Tag</SelectItem>
                                        <SelectItem value="update_field">Atualizar Campo</SelectItem>
                                        <SelectItem value="send_message">Enviar Mensagem</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {massActionType === 'add_tag' && (
                                <div>
                                    <Label>Tag para Adicionar</Label>
                                    <Input
                                        value={massActionData.tag}
                                        onChange={(e) => setMassActionData(prev => ({ ...prev, tag: e.target.value }))}
                                        placeholder="Nome da tag"
                                    />
                                </div>
                            )}

                            {massActionType === 'remove_tag' && (
                                <div>
                                    <Label>Tag para Remover</Label>
                                    <Select 
                                        value={massActionData.tag} 
                                        onValueChange={(value) => setMassActionData(prev => ({ ...prev, tag: value }))}
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
                            )}

                            {massActionType === 'update_field' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Campo</Label>
                                        <Input
                                            value={massActionData.field}
                                            onChange={(e) => setMassActionData(prev => ({ ...prev, field: e.target.value }))}
                                            placeholder="Nome do campo"
                                        />
                                    </div>
                                    <div>
                                        <Label>Valor</Label>
                                        <Input
                                            value={massActionData.value}
                                            onChange={(e) => setMassActionData(prev => ({ ...prev, value: e.target.value }))}
                                            placeholder="Valor do campo"
                                        />
                                    </div>
                                </div>
                            )}

                            {massActionType === 'send_message' && (
                                <div>
                                    <Label>Mensagem</Label>
                                    <textarea
                                        className="w-full p-3 border rounded-lg resize-none"
                                        rows={4}
                                        value={massActionData.message}
                                        onChange={(e) => setMassActionData(prev => ({ ...prev, message: e.target.value }))}
                                        placeholder="Digite a mensagem para enviar aos contatos selecionados..."
                                    />
                                </div>
                            )}

                            <Button
                                onClick={executeMassAction}
                                disabled={!massActionType || selectedContacts.length === 0}
                                className="w-full"
                            >
                                Executar Ação ({selectedContacts.length} contatos)
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ContactSegmentation;