import { z } from 'zod';

export interface ToolMetadata {
  name: string;
  description: string;
  inputSchema: z.ZodType<any>;
  outputSchema?: z.ZodType<any>;
}

export interface Tool {
  metadata: ToolMetadata;
  execute(input: any): Promise<any>;
}

export class ToolRegistry {
  private tools: Map<string, Tool> = new Map();

  public register(tool: Tool): void {
    this.tools.set(tool.metadata.name, tool);
  }

  public get(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  public list(): ToolMetadata[] {
    return Array.from(this.tools.values()).map(t => t.metadata);
  }

  public async execute(name: string, input: any): Promise<any> {
    const tool = this.get(name);
    if (!tool) throw new Error(`Tool ${name} not found`);

    // Validate input
    const validatedInput = tool.metadata.inputSchema.parse(input);
    return tool.execute(validatedInput);
  }
}
