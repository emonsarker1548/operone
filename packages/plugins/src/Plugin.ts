export interface PluginManifest {
  id: string;
  version: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface Plugin {
  manifest: PluginManifest;
  activate(): Promise<void>;
  deactivate(): Promise<void>;
}
