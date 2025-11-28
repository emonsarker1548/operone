#!/usr/bin/env node
/**
 * End-to-End Streaming AI Test
 * 
 * This is a standalone test that demonstrates direct AI communication
 * with streaming responses using Ollama.
 * 
 * Run with: pnpm tsx src/test-streaming.ts
 */

import { ModelProvider } from './model-provider';
import { StreamHandler } from './streaming/StreamHandler';
import type { OllamaConfig } from '@repo/types';

async function testStreamingChat() {
  console.log('🚀 Starting Streaming AI Test...\n');

  // Configure Ollama provider
  const config: OllamaConfig = {
    type: 'ollama',
    model: 'llama3.2',
    baseURL: 'http://localhost:11434',
  };

  console.log('📡 Connecting to Ollama...');
  console.log(`   Model: ${config.model}`);
  console.log(`   URL: ${config.baseURL}\n`);

  try {
    // Create provider and get model
    const provider = new ModelProvider(config);
    const model = provider.getModel();

    // Test connection first
    console.log('🔍 Testing connection...');
    const connectionTest = await provider.testConnection();
    
    if (!connectionTest.success) {
      console.error('❌ Connection failed:', connectionTest.error);
      process.exit(1);
    }
    
    console.log('✅ Connection successful!\n');

    // Create stream handler
    const streamHandler = new StreamHandler();

    // Test message
    const testMessage = 'Tell me a short joke about programming in 2-3 sentences.';
    
    console.log('💬 User Message:');
    console.log(`   "${testMessage}"\n`);
    
    console.log('🤖 AI Response (streaming):');
    console.log('   ');

    // Stream the response
    const response = await streamHandler.streamResponse(
      model,
      testMessage,
      undefined,
      {
        onToken: (token) => {
          // Print each token as it arrives
          process.stdout.write(token);
        },
        onComplete: (fullText) => {
          console.log('\n');
          console.log('✅ Streaming completed!');
          console.log(`📊 Total characters: ${fullText.length}`);
        },
        onError: (error) => {
          console.error('❌ Streaming error:', error.message);
        }
      }
    );

    console.log('\n✨ Test completed successfully!\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testStreamingChat().catch(console.error);
