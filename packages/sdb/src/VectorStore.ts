import { Embedder } from './Embedder';

export interface VectorDocument {
  id: string;
  content: string;
  metadata?: Record<string, any>;
  embedding?: number[];
}

export class VectorStore {
  private embedder: Embedder;
  private documents: Map<string, VectorDocument>;

  constructor() {
    this.embedder = new Embedder();
    this.documents = new Map();
  }

  async addDocument(doc: VectorDocument): Promise<void> {
    if (!doc.embedding) {
      doc.embedding = await this.embedder.embed(doc.content);
    }
    this.documents.set(doc.id, doc);
  }

  async search(query: string, limit: number = 5): Promise<VectorDocument[]> {
    const queryEmbedding = await this.embedder.embed(query);
    
    // Naive cosine similarity search for now
    const results = Array.from(this.documents.values()).map((doc) => ({
      doc,
      score: this.cosineSimilarity(queryEmbedding, doc.embedding!),
    }));

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((r) => r.doc);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
