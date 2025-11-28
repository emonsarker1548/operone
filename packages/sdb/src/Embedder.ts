export class Embedder {
  async embed(text: string): Promise<number[]> {
    // Placeholder for embedding generation
    // Real implementation would use a local model or API
    return new Array(1536).fill(0).map(() => Math.random());
  }
}
