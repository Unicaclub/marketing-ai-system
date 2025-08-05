import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Area, AreaChart 
} from 'recharts';
import { 
    TrendingUp, TrendingDown, Users, MessageCircle, Target, 
    Calendar as CalendarIcon, Download, RefreshCw, Play, Pause
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AutomationAnalytics = () => {
    const { token } = useAuth();
    const [automations, setAutomations] = useState([]);
    const [selectedAutomation, setSelectedAutomation] = useState('');
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState({
        from: subDays(new Date(), 30),
        to: new Date()
    });
    const [overviewData, setOverviewData] = useState({
        totalAutomations: 0,
        activeAutomations: 0,
        totalTriggers: 0,
        totalMessages: 0,
        avgConversion: 0
    });

    useEffect(() => {
        fetchAutomations();
        fetchOverviewData();
    }, []);

    useEffect(() => {
        if (selectedAutomation) {
            fetchAnalytics();
        }
    }, [selectedAutomation, dateRange]);

    const fetchAutomations = async () => {
        try {
            const response = await fetch(`${VITE_API_URL}/api/automations`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setAutomations(data.automations);
                if (data.automations.length > 0) {
                    setSelectedAutomation(data.automations[0].id.toString());
                }
            }
        } catch (error) {
            console.error('Erro ao buscar automações:', error);
        }
    };

    const fetchOverviewData = async () => {
        try {
            // Buscar dados gerais de todas as automações
            const automationsResponse = await fetch(`${VITE_API_URL}/api/automations`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (automationsResponse.ok) {
                const automationsData = await automationsResponse.json();
                const automations = automationsData.automations;
                
                setOverviewData({
                    totalAutomations: automations.length,
                    activeAutomations: automations.filter(a => a.is_active).length,
                    totalTriggers: 0, // Será calculado pela API
                    totalMessages: 0, // Será calculado pela API
                    avgConversion: 0 // Será calculado pela API
                });
            }
        } catch (error) {
            console.error('Erro ao buscar dados gerais:', error);
        }
    };

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const startDate = format(dateRange.from, 'yyyy-MM-dd');
            const endDate = format(dateRange.to, 'yyyy-MM-dd');
            
            const response = await fetch(
                `${VITE_API_URL}/api/automations/${selectedAutomation}/analytics?start_date=${startDate}&end_date=${endDate}`,
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                setAnalytics(data);
            }
        } catch (error) {
            console.error('Erro ao buscar analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSelectedAutomationInfo = () => {
        return automations.find(a => a.id.toString() === selectedAutomation);
    };

    const formatChartData = (dailyMetrics) => {
        if (!dailyMetrics) return [];
        
        return dailyMetrics.map(metric => ({
            date: format(new Date(metric.date), 'dd/MM', { locale: ptBR }),
            triggers: metric.triggers_count,
            messages: metric.messages_sent,
            contacts: metric.unique_contacts,
            conversion: (metric.conversion_rate * 100).toFixed(1)
        }));
    };

    const getPerformanceData = () => {
        if (!analytics) return [];
        
        return [
            { name: 'Triggers', value: analytics.total_triggers, color: COLORS[0] },
            { name: 'Mensagens', value: analytics.total_messages, color: COLORS[1] },
            { name: 'Conversões', value: Math.round(analytics.total_messages * analytics.avg_conversion_rate / 100), color: COLORS[2] }
        ];
    };

    const MetricCard = ({ title, value, change, icon: Icon, color = "blue" }) => (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-2xl font-bold">{value}</p>
                        {change !== undefined && (
                            <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                                {Math.abs(change)}%
                            </div>
                        )}
                    </div>
                    <div className={`p-3 rounded-full bg-${color}-100`}>
                        <Icon className={`w-6 h-6 text-${color}-600`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Analytics de Automações</h1>
                    <p className="text-gray-600">Monitore o desempenho das suas automações</p>
                </div>
                
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchAnalytics} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Atualizar
                    </Button>
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                    </Button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total de Automações"
                    value={overviewData.totalAutomations}
                    icon={Target}
                    color="blue"
                />
                <MetricCard
                    title="Automações Ativas"
                    value={overviewData.activeAutomations}
                    icon={Play}
                    color="green"
                />
                <MetricCard
                    title="Mensagens Enviadas"
                    value={analytics?.total_messages || 0}
                    icon={MessageCircle}
                    color="purple"
                />
                <MetricCard
                    title="Taxa de Conversão"
                    value={`${(analytics?.avg_conversion_rate || 0).toFixed(1)}%`}
                    icon={TrendingUp}
                    color="orange"
                />
            </div>

            {/* Filtros */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-sm font-medium">Automação</label>
                            <Select value={selectedAutomation} onValueChange={setSelectedAutomation}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma automação" />
                                </SelectTrigger>
                                <SelectContent>
                                    {automations.map(automation => (
                                        <SelectItem key={automation.id} value={automation.id.toString()}>
                                            <div className="flex items-center gap-2">
                                                {automation.name}
                                                <Badge variant={automation.is_active ? "default" : "secondary"}>
                                                    {automation.is_active ? 'Ativa' : 'Inativa'}
                                                </Badge>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div>
                            <label className="text-sm font-medium">Período</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-72">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateRange?.from ? (
                                            dateRange.to ? (
                                                <>
                                                    {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                                                    {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                                                </>
                                            ) : (
                                                format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                                            )
                                        ) : (
                                            <span>Selecione o período</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
                                    <div className="p-3 border-b">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => setDateRange({
                                                    from: subDays(new Date(), 7),
                                                    to: new Date()
                                                })}
                                            >
                                                Últimos 7 dias
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => setDateRange({
                                                    from: subDays(new Date(), 30),
                                                    to: new Date()
                                                })}
                                            >
                                                Últimos 30 dias
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => setDateRange({
                                                    from: startOfMonth(new Date()),
                                                    to: endOfMonth(new Date())
                                                })}
                                            >
                                                Este mês
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => setDateRange({
                                                    from: subDays(new Date(), 90),
                                                    to: new Date()
                                                })}
                                            >
                                                Últimos 90 dias
                                            </Button>
                                        </div>
                                    </div>
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={dateRange?.from}
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Charts */}
            {loading ? (
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Carregando analytics...</p>
                    </CardContent>
                </Card>
            ) : analytics ? (
                <Tabs defaultValue="performance" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="performance">Performance</TabsTrigger>
                        <TabsTrigger value="trends">Tendências</TabsTrigger>
                        <TabsTrigger value="engagement">Engajamento</TabsTrigger>
                    </TabsList>

                    <TabsContent value="performance" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Gráfico de Barras - Performance Diária */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Performance Diária</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={formatChartData(analytics.daily_metrics)}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="triggers" fill={COLORS[0]} name="Triggers" />
                                            <Bar dataKey="messages" fill={COLORS[1]} name="Mensagens" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Gráfico de Pizza - Distribuição */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Distribuição de Atividades</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={getPerformanceData()}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, value }) => `${name}: ${value}`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {getPerformanceData().map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Resumo de Métricas */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Resumo do Período</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{analytics.total_triggers}</div>
                                        <div className="text-sm text-gray-600">Total de Triggers</div>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">{analytics.total_messages}</div>
                                        <div className="text-sm text-gray-600">Mensagens Enviadas</div>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {analytics.daily_metrics?.reduce((sum, m) => sum + m.unique_contacts, 0) || 0}
                                        </div>
                                        <div className="text-sm text-gray-600">Contatos Únicos</div>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">
                                            {(analytics.avg_conversion_rate || 0).toFixed(1)}%
                                        </div>
                                        <div className="text-sm text-gray-600">Taxa de Conversão</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="trends" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tendências de Crescimento</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={formatChartData(analytics.daily_metrics)}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="triggers" stroke={COLORS[0]} name="Triggers" />
                                        <Line type="monotone" dataKey="messages" stroke={COLORS[1]} name="Mensagens" />
                                        <Line type="monotone" dataKey="contacts" stroke={COLORS[2]} name="Contatos" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="engagement" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Taxa de Conversão ao Longo do Tempo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <AreaChart data={formatChartData(analytics.daily_metrics)}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area 
                                            type="monotone" 
                                            dataKey="conversion" 
                                            stroke={COLORS[3]} 
                                            fill={COLORS[3]} 
                                            fillOpacity={0.3}
                                            name="Taxa de Conversão (%)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            ) : (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-gray-600">
                            {selectedAutomation 
                                ? 'Nenhum dado disponível para o período selecionado'
                                : 'Selecione uma automação para ver os analytics'
                            }
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AutomationAnalytics;