import React, { useEffect, useState } from 'react';
import { useOS } from '../contexts/OSContext';

export const SystemStatus: React.FC = () => {
    const { system } = useOS();
    const [metrics, setMetrics] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await system.getMetrics();
                setMetrics(data);
            } catch (err) {
                console.error('Failed to fetch metrics:', err);
                setError('Failed to fetch system metrics');
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000);
        return () => clearInterval(interval);
    }, [system]);

    if (error) {
        return <div className="p-4 text-red-500 bg-red-100 rounded-md">{error}</div>;
    }

    if (!metrics) {
        return <div className="p-4 text-gray-500">Loading system metrics...</div>;
    }

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">System Status</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-500">CPU Usage</p>
                    <p className="text-xl font-bold">{metrics.cpu?.usage?.toFixed(1)}%</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Memory Usage</p>
                    <p className="text-xl font-bold">
                        {((metrics.memory?.used / metrics.memory?.total) * 100).toFixed(1)}%
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Uptime</p>
                    <p className="text-xl font-bold">{Math.floor(metrics.uptime / 3600)}h</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Platform</p>
                    <p className="text-xl font-bold">{metrics.platform}</p>
                </div>
            </div>
        </div>
    );
};
