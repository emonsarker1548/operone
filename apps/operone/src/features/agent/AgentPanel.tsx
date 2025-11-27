import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit } from "lucide-react";

export function AgentPanel() {
    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5" />
                    Agent Activity
                </h2>
                <Badge variant="outline" className="text-xs">Idle</Badge>
            </div>

            <ScrollArea className="flex-1">
                <div className="space-y-4 pr-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">System Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">
                                Agent system initialized. Waiting for tasks...
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
        </div>
    );
}
