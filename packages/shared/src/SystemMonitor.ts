import * as si from 'systeminformation';

export interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    speed: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usagePercent: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usagePercent: number;
  };
  uptime: number;
}

export class SystemMonitor {
  /**
   * Get current system metrics
   */
  async getMetrics(): Promise<SystemMetrics> {
    const [cpu, mem, disk, uptime] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.time(),
    ]);

    const primaryDisk = disk[0] || { size: 0, used: 0, available: 0 };

    return {
      cpu: {
        usage: cpu.currentLoad,
        cores: cpu.cpus?.length || 0,
        speed: cpu.avgLoad || 0,
      },
      memory: {
        total: mem.total,
        used: mem.used,
        free: mem.free,
        usagePercent: (mem.used / mem.total) * 100,
      },
      disk: {
        total: primaryDisk.size,
        used: primaryDisk.used,
        free: primaryDisk.available,
        usagePercent: (primaryDisk.used / primaryDisk.size) * 100,
      },
      uptime: uptime.uptime,
    };
  }

  /**
   * Monitor system metrics at interval
   */
  startMonitoring(
    intervalMs: number,
    callback: (metrics: SystemMetrics) => void
  ): NodeJS.Timeout {
    const interval = setInterval(async () => {
      const metrics = await this.getMetrics();
      callback(metrics);
    }, intervalMs);

    return interval;
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(interval: NodeJS.Timeout): void {
    clearInterval(interval);
  }
}
