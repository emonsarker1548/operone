import { Plugin, PluginManifest } from './Plugin';
import { NodeVM } from 'vm2';

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();

  async loadPlugin(path: string): Promise<void> {
    // Placeholder for loading plugin from path
    // In a real implementation, this would read package.json and load the module
    // potentially using vm2 for sandboxing
    console.log(`Loading plugin from ${path}`);
  }

  registerPlugin(plugin: Plugin): void {
    this.plugins.set(plugin.manifest.id, plugin);
  }

  async activatePlugin(id: string): Promise<void> {
    const plugin = this.plugins.get(id);
    if (plugin) {
      await plugin.activate();
    }
  }

  async deactivatePlugin(id: string): Promise<void> {
    const plugin = this.plugins.get(id);
    if (plugin) {
      await plugin.deactivate();
    }
  }

  getPlugins(): PluginManifest[] {
    return Array.from(this.plugins.values()).map((p) => p.manifest);
  }
}
