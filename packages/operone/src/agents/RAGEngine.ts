import { MemoryManager } from '../memory/MemoryManager';
import { EventBus } from '../core/EventBus';

export interface RAGEngineOptions {
  memoryManager: MemoryManager;
  embeddingModel: any;
  eventBus?: EventBus;
}

export interface Document {
  id: string;
  content: string;
  metadata?: Record<string, any>;
  embedding?: number[];
}

/**
 * RAGEngine - Retrieval Augmented Generation
 * Handles document ingestion, embedding, and retrieval
 */
export class RAGEngine {
  private memoryManager: MemoryManager;
  private embeddingModel: any;
  private eventBus: EventBus;
  private documents: Map<string, Document> = new Map();

  constructor(options: RAGEngineOptions | MemoryManager, embeddingModel?: any) {
    // Support both old and new constructor signatures
    if (options instanceof MemoryManager) {
      this.memoryManager = options;
      this.embeddingModel = embeddingModel || null;
      this.eventBus = EventBus.getInstance();
    } else {
      this.memoryManager = options.memoryManager;
      this.embeddingModel = options.embeddingModel;
      this.eventBus = options.eventBus || EventBus.getInstance();
    }
  }

  /**
   * Ingest a document into the RAG system
   */
  async ingestDocument(id: string, content: string, metadata?: Record<string, any>): Promise<void> {
    try {
      const document: Document = {
        id,
        content,
        metadata
      };

      // Generate embedding if model is available
      if (this.embeddingModel) {
        try {
          // This would use the actual embedding model
          // For now, we'll skip actual embedding generation
          // document.embedding = await this.generateEmbedding(content);
        } catch (error) {
          console.warn('Failed to generate embedding:', error);
        }
      }

      // Store in documents map
      this.documents.set(id, document);

      // Store in long-term memory
      await this.memoryManager.longTerm.store(content);

      this.eventBus.publish('rag', 'document-ingested', { id, size: content.length });
    } catch (error) {
      console.error('Error ingesting document:', error);
      throw error;
    }
  }

  /**
   * Query the RAG system for relevant documents
   */
  async query(query: string, topK: number = 3): Promise<Document[]> {
    try {
      // If we have embeddings, use semantic search
      if (this.embeddingModel && this.documents.size > 0) {
        // This would implement actual vector similarity search
        // For now, fall back to text-based search
      }

      // Text-based search as fallback
      const results = await this.memoryManager.longTerm.query(query);
      
      // Convert results to documents
      const documents: Document[] = results.slice(0, topK).map((content, index) => ({
        id: `result-${index}`,
        content
      }));

      this.eventBus.publish('rag', 'query-executed', { query, resultsCount: documents.length });

      return documents;
    } catch (error) {
      console.error('Error querying RAG:', error);
      return [];
    }
  }

  /**
   * Get statistics about the RAG system
   */
  getStats(): { vectorDocuments: number; shortTermMemory: number } {
    return {
      vectorDocuments: this.documents.size,
      shortTermMemory: this.memoryManager.shortTerm.length
    };
  }

  /**
   * Clear all documents
   */
  clear(): void {
    this.documents.clear();
    // Note: We don't clear long-term memory as it's managed separately
  }

  /**
   * Get a specific document by ID
   */
  getDocument(id: string): Document | undefined {
    return this.documents.get(id);
  }

  /**
   * Get all documents
   */
  getAllDocuments(): Document[] {
    return Array.from(this.documents.values());
  }
}
