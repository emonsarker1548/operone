import { useEffect, useState } from 'react';
import { Activity, Brain, Database, FileSearch, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ActivityEvent {
    id: string;
    type: 'agent' | 'reasoning' | 'planner' | 'rag' | 'stream';
    timestamp: Date;
    message: string;
    data?: any;
}

export function ActivityPanel() {
    const [events, setEvents] = useState<ActivityEvent[]>([]);
    const [stats, setStats] = useState({
        vectorDocuments: 0,
        shortTermMemory: 0
    });

    useEffect(() => {
        // Listen for agent events from main process
        if (window.electronAPI) {
            const handleAgentEvent = (_event: any, payload: any) => {
                const newEvent: ActivityEvent = {
                    id: Date.now().toString(),
                    type: payload.type || 'agent',
                    timestamp: new Date(),
                    message: payload.message || JSON.stringify(payload),
                    data: payload
                };
                setEvents(prev => [newEvent, ...prev].slice(0, 50)); // Keep last 50 events
            };

            // Subscribe to events
            // Note: This would need to be implemented in preload.ts
            // For now, we'll poll for stats
            const interval = setInterval(async () => {
                try {
                    const newStats = await window.electronAPI.getStats();
                    setStats(newStats);
                } catch (error) {
                    console.error('Failed to fetch stats:', error);
                }
            }, 5000);

            return () => {
                clearInterval(interval);
            };
        }
    }, []);

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'reasoning':
                return <Brain className="w-4 h-4" />;
            case 'rag':
                return <FileSearch className="w-4 h-4" />;
            case 'planner':
                return <Zap className="w-4 h-4" />;
            case 'stream':
                return <Activity className="w-4 h-4" />;
            default:
                return <Activity className="w-4 h-4" />;
        }
    };

    const getEventColor = (type: string) => {
        switch (type) {
            case 'reasoning':
                return 'bg-blue-500/10 text-blue-500';
            case 'rag':
                return 'bg-purple-500/10 text-purple-500';
            case 'planner':
                return 'bg-yellow-500/10 text-yellow-500';
            case 'stream':
                return 'bg-green-500/10 text-green-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Activity
                </h2>
            </div>

            {/* Stats Section */}
            <div className="p-4 space-y-3">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Database className="w-4 h-4" />
                            Memory Stats
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Vector Docs</span>
                            <Badge variant="secondary">{stats.vectorDocuments}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Short-term</span>
                            <Badge variant="secondary">{stats.shortTermMemory}</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Separator />

            {/* Events Section */}
            <div className="flex-1 overflow-hidden">
                <div className="p-4">
                    <h3 className="text-sm font-medium mb-3">Recent Events</h3>
                </div>
                <ScrollArea className="h-full px-4">
                    <div className="space-y-3 pb-4">
                        {events.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No activity yet
                            </div>
                        ) : (
                            events.map((event) => (
                                <Card key={event.id} className="p-3">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
                                            {getEventIcon(event.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className="text-xs">
                                                    {event.type}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {event.timestamp.toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-foreground break-words">
                                                {event.message}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
