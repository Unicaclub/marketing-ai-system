import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Trash2, Plus, Eye, Copy, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TEMPLATE_CATEGORIES = [
    'Boas-vindas',
    'Promoções',
    'Suporte',
    'Cobrança',
    'Agendamento',
    'Feedback',
    'Abandono de Carrinho',
    'Pós-venda',
    'Geral'
];

const COMMON_VARIABLES = [
    { name: 'name', description: 'Nome do contato', example: 'João Silva' },
    { name: 'phone', description: 'Telefone do contato', example: '+5511999999999' },
    { name: 'email', description: 'Email do contato', example: 'joao@email.com' },
    { name: 'company', description: 'Empresa do contato', example: 'Empresa ABC' },
    { name: 'first_name', description: 'Primeiro nome', example: 'João' },
    { name: 'last_name', description: 'Sobrenome', example: 'Silva' },
    { name: 'city', description: 'Cidade', example: 'São Paulo' },
    { name: 'date', description: 'Data atual', example: '15/01/2025' },
    { name: 'time', description: 'Hora atual', example: '14:30' }
];

const TemplateManager = () => {
    const { token } = useAuth();
    const [templates, setTemplates] = useState([]);
    const [filteredTemplates, setFilteredTemplates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [previewData, setPreviewData] = useState({
        name: 'João Silva',
        phone: '+5511999999999',
        email: 'joao@email.com',
        company: 'Empresa ABC'
    });

    const [newTemplate, setNewTemplate] = useState({
        name: '',
        category: '',
        content: '',
        variables: []
    });

    useEffect(() => {
        fetchTemplates();
    }, []);

    useEffect(() => {
        filterTemplates();
    }, [templates, searchTerm, selectedCategory]);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const filterTemplates = () => {
        let filtered = templates;

        if (searchTerm) {
            filtered = filtered.filter(template => 
                template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                template.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(template => template.category === selectedCategory);
        }

        setFilteredTemplates(filtered);
    };

    const detectVariables = (content) => {
        const variableRegex = /\{\{(\w+)\}\}/g;
        const variables = [];
        let match;

        while ((match = variableRegex.exec(content)) !== null) {
            if (!variables.includes(match[1])) {
                variables.push(match[1]);
            }
        }

        return variables;
    };

    const handleContentChange = (content) => {
        const detectedVariables = detectVariables(content);
        setNewTemplate(prev => ({
            ...prev,
            content,
            variables: detectedVariables
        }));
    };

    const saveTemplate = async () => {
        try {
            const method = editingTemplate ? 'PUT' : 'POST';
            const url = editingTemplate 
                ? `${VITE_API_URL}/api/templates/${editingTemplate.id}`
                : `${VITE_API_URL}/api/templates`;

            const response = await fetch(url, {
                method,
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTemplate)
            });

            if (response.ok) {
                fetchTemplates();
                resetForm();
                setIsDialogOpen(false);
            } else {
                const error = await response.json();
                alert(`Erro: ${error.error}`);
            }
        } catch (error) {
            alert(`Erro ao salvar template: ${error.message}`);
        }
    };

    const deleteTemplate = async (templateId) => {
        if (!confirm('Tem certeza que deseja excluir este template?')) return;

        try {
            const response = await fetch(`${VITE_API_URL}/api/templates/${templateId}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                fetchTemplates();
            }
        } catch (error) {
            alert(`Erro ao excluir template: ${error.message}`);
        }
    };

    const resetForm = () => {
        setNewTemplate({
            name: '',
            category: '',
            content: '',
            variables: []
        });
        setEditingTemplate(null);
    };

    const editTemplate = (template) => {
        setEditingTemplate(template);
        setNewTemplate({
            name: template.name,
            category: template.category || '',
            content: template.content,
            variables: template.variables || []
        });
        setIsDialogOpen(true);
    };

    const duplicateTemplate = (template) => {
        setNewTemplate({
            name: `${template.name} (Cópia)`,
            category: template.category || '',
            content: template.content,
            variables: template.variables || []
        });
        setEditingTemplate(null);
        setIsDialogOpen(true);
    };

    const previewTemplateWithData = (template) => {
        let content = template.content;
        
        // Substituir variáveis pelos dados de preview
        Object.entries(previewData).forEach(([key, value]) => {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            content = content.replace(regex, value);
        });

        // Adicionar data e hora atuais
        const now = new Date();
        content = content.replace(/\{\{date\}\}/g, now.toLocaleDateString('pt-BR'));
        content = content.replace(/\{\{time\}\}/g, now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));

        return content;
    };

    const insertVariable = (variable) => {
        const textarea = document.getElementById('template-content');
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const content = newTemplate.content;
            const newContent = content.substring(0, start) + `{{${variable}}}` + content.substring(end);
            
            handleContentChange(newContent);
            
            // Manter foco e posição do cursor
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4);
            }, 10);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Gerenciador de Templates</h1>
                    <p className="text-gray-600">Crie e gerencie templates de mensagem reutilizáveis</p>
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="w-4 h-4 mr-2" />
                            Novo Template
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingTemplate ? 'Editar Template' : 'Novo Template'}
                            </DialogTitle>
                        </DialogHeader>

                        <Tabs defaultValue="editor" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="editor">Editor</TabsTrigger>
                                <TabsTrigger value="preview">Preview</TabsTrigger>
                            </TabsList>

                            <TabsContent value="editor" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Nome do Template</Label>
                                        <Input
                                            value={newTemplate.name}
                                            onChange={(e) => setNewTemplate(prev => ({...prev, name: e.target.value}))}
                                            placeholder="Ex: Mensagem de Boas-vindas"
                                        />
                                    </div>
                                    <div>
                                        <Label>Categoria</Label>
                                        <Select
                                            value={newTemplate.category}
                                            onValueChange={(value) => setNewTemplate(prev => ({...prev, category: value}))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione uma categoria" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TEMPLATE_CATEGORIES.map(category => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                        <Label>Conteúdo da Mensagem</Label>
                                        <Textarea
                                            id="template-content"
                                            value={newTemplate.content}
                                            onChange={(e) => handleContentChange(e.target.value)}
                                            placeholder="Digite o conteúdo do template... Use {{variavel}} para inserir dados dinâmicos"
                                            rows={8}
                                            className="resize-none"
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label>Variáveis Disponíveis</Label>
                                        <div className="space-y-2 max-h-64 overflow-y-auto border rounded p-2">
                                            {COMMON_VARIABLES.map(variable => (
                                                <div key={variable.name} className="p-2 hover:bg-gray-50 rounded cursor-pointer" 
                                                     onClick={() => insertVariable(variable.name)}>
                                                    <div className="font-medium text-sm">{'{{' + variable.name + '}}'}</div>
                                                    <div className="text-xs text-gray-500">{variable.description}</div>
                                                    <div className="text-xs text-blue-600">Ex: {variable.example}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {newTemplate.variables.length > 0 && (
                                    <div>
                                        <Label>Variáveis Detectadas</Label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {newTemplate.variables.map(variable => (
                                                <Badge key={variable} variant="outline">
                                                    {'{{' + variable + '}}'}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button onClick={saveTemplate} disabled={!newTemplate.name.trim() || !newTemplate.content.trim()}>
                                        {editingTemplate ? 'Atualizar' : 'Salvar'} Template
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="preview" className="space-y-4">
                                <div>
                                    <Label>Dados para Preview</Label>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        {Object.entries(previewData).map(([key, value]) => (
                                            <div key={key}>
                                                <Label className="text-sm">{key}</Label>
                                                <Input
                                                    value={value}
                                                    onChange={(e) => setPreviewData(prev => ({...prev, [key]: e.target.value}))}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label>Preview da Mensagem</Label>
                                    <div className="mt-2 p-4 border rounded-lg bg-gray-50 whitespace-pre-wrap">
                                        {previewTemplateWithData({ content: newTemplate.content })}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filtros */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <Label>Buscar Templates</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Buscar por nome ou conteúdo..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <Label>Categoria</Label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Todas as categorias" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Todas as categorias</SelectItem>
                                    {TEMPLATE_CATEGORIES.map(category => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Lista de Templates */}
            {loading ? (
                <div className="text-center py-8">Carregando templates...</div>
            ) : filteredTemplates.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-8">
                        <p className="text-gray-500">
                            {templates.length === 0 
                                ? 'Nenhum template encontrado. Crie seu primeiro template!'
                                : 'Nenhum template encontrado com os filtros aplicados.'
                            }
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map(template => (
                        <Card key={template.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{template.name}</CardTitle>
                                        {template.category && (
                                            <Badge variant="secondary" className="mt-1">
                                                {template.category}
                                            </Badge>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setPreviewTemplate(template);
                                                // Abrir modal de preview se necessário
                                            }}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => duplicateTemplate(template)}
                                        >
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => editTemplate(template)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => deleteTemplate(template.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600 line-clamp-3">
                                            {template.content.substring(0, 150)}
                                            {template.content.length > 150 && '...'}
                                        </p>
                                    </div>
                                    
                                    {template.variables && template.variables.length > 0 && (
                                        <div>
                                            <div className="flex flex-wrap gap-1">
                                                {template.variables.slice(0, 3).map(variable => (
                                                    <Badge key={variable} variant="outline" className="text-xs">
                                                        {'{{' + variable + '}}'}
                                                    </Badge>
                                                ))}
                                                {template.variables.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{template.variables.length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="text-xs text-gray-500">
                                        Criado em: {new Date(template.created_at).toLocaleDateString('pt-BR')}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TemplateManager;