import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database, FileText } from "lucide-react";

export function ContextPanel() {
    return (
        <div className="h-full flex flex-col gap-4 mt-8">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Context & Memory
                </h2>
            </div>

            <ScrollArea className="flex-1">
                <div className="space-y-4 pr-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Active Context
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">
                                No active context retrieved yet.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
        </div>
    );
}
