import { generateText } from 'ai';
import { ModelProvider } from '../model-provider';

export interface Entity {
  name: string;
  type: string;
  description?: string;
}

export interface Relation {
  source: string;
  target: string;
  type: string;
}

export interface KnowledgeGraph {
  entities: Entity[];
  relations: Relation[];
}

export class EntityExtractor {
  private modelProvider: ModelProvider;

  constructor(modelProvider: ModelProvider) {
    this.modelProvider = modelProvider;
  }

  public async extract(text: string): Promise<KnowledgeGraph> {
    const systemPrompt = `You are an expert Knowledge Graph builder.
Extract entities (people, places, organizations, concepts) and relationships between them from the provided text.

Return a JSON object with the following structure:
{
  "entities": [
    { "name": "John Doe", "type": "Person", "description": "Software Engineer" }
  ],
  "relations": [
    { "source": "John Doe", "target": "Google", "type": "WORKS_FOR" }
  ]
}`;

    const { text: result } = await generateText({
      model: this.modelProvider.getModel(),
      system: systemPrompt,
      prompt: `Text: ${text}`,
    });

    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return { entities: [], relations: [] };
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Failed to parse entity extraction result', error);
      return { entities: [], relations: [] };
    }
  }
}
