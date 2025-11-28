import { encoding_for_model, TiktokenModel } from 'tiktoken';

export class TokenCounter {
  countTokens(text: string, model: TiktokenModel = 'gpt-4'): number {
    const enc = encoding_for_model(model);
    const tokens = enc.encode(text);
    enc.free();
    return tokens.length;
  }

  truncate(text: string, maxTokens: number, model: TiktokenModel = 'gpt-4'): string {
    const enc = encoding_for_model(model);
    const tokens = enc.encode(text);
    if (tokens.length <= maxTokens) {
      enc.free();
      return text;
    }
    const truncated = enc.decode(tokens.slice(0, maxTokens));
    enc.free();
    return new TextDecoder().decode(truncated);
  }
}
