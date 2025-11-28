# Operone Packages - Core Architecture & AI Integration

This document provides detailed information about all packages in the Operone monorepo, their purposes, dependencies, and usage patterns.

## 📦 Packages Overview

The Operone monorepo contains 5 core packages that provide shared functionality, AI capabilities, and development tools for all applications.

```
packages/
├── eslint-config/         # Shared ESLint configurations
├── mcp/                   # Model Context Protocol tools
├── operone/              # Core AI & reasoning engine
├── types/                # Shared TypeScript types
└── typescript-config/    # Shared TypeScript configurations
```

---

## 🔧 Development Tools

### `@repo/eslint-config`
**Version**: 0.0.0 | **Type**: Development Tool

Shared ESLint configurations for consistent code quality across all packages and applications.

#### Features
- **Base Configuration**: General JavaScript/TypeScript rules
- **Next.js Configuration**: Next.js specific linting rules
- **React Internal**: Internal React component patterns

#### Exports
```typescript
import baseConfig from '@repo/eslint-config/base'
import nextJsConfig from '@repo/eslint-config/next-js'
import reactInternalConfig from '@repo/eslint-config/react-internal'
```

#### Dependencies
- **ESLint**: ^9.39.1 - Core linting engine
- **TypeScript ESLint**: ^8.46.3 - TypeScript support
- **React Plugins**: React and React Hooks linting
- **Prettier Integration**: Code formatting consistency

#### Usage
```javascript
// eslint.config.js
import baseConfig from '@repo/eslint-config/base'
import reactConfig from '@repo/eslint-config/react-internal'

export default [
  ...baseConfig,
  ...reactConfig
]
```

### `@repo/typescript-config`
**Version**: 0.0.0 | **Type**: Development Tool

Shared TypeScript configuration files for consistent compiler settings across the monorepo.

#### Features
- **Strict Type Checking**: Enhanced type safety
- **Path Mapping**: Consistent import aliases
- **Build Optimization**: Optimized compiler settings

#### Usage
```json
// tsconfig.json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@repo/*": ["../../packages/*/src"]
    }
  }
}
```

---

## 🤖 AI & Core Packages

### `@repo/types`
**Version**: 0.0.0 | **Type**: Core Types

Centralized TypeScript type definitions for the entire Operone ecosystem.

#### Core Interfaces

##### Agent System
```typescript
interface Agent {
  id: string
  name: string
  role: 'os' | 'assistant'
  think(input: string, options?: any): Promise<string>
  act(action: string): Promise<void>
  observe(): Promise<string>
}
```

##### Memory System
```typescript
interface Memory {
  shortTerm: string[]
  longTerm: {
    query(text: string): Promise<string[]>
    store(text: string): Promise<void>
  }
}
```

##### AI Provider Types
```typescript
type ProviderType = 'openai' | 'anthropic' | 'ollama' | 'openrouter' | 'google' | 'mistral' | 'custom'

interface BaseProviderConfig {
  type: ProviderType
  apiKey?: string
  baseURL?: string
  model: string
}
```

##### Chat System
```typescript
interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  type?: MessageType
  images?: GeneratedImage[]
  exactText?: ExactTextResult
}
```

#### Project Management
```typescript
interface Project {
  id: string
  name: string
  category: string
  description?: string
  createdAt: Date
  updatedAt: Date
  conversationIds: string[]
}

interface Chat {
  id: string
  title: string
  projectId?: string
  createdAt: Date
  updatedAt: Date
  messages: ChatMessage[]
}
```

#### Dependencies
- **Development Only**: TypeScript, Vitest for testing
- **No Runtime Dependencies**: Pure type definitions

### `@repo/mcp-tools`
**Version**: 0.0.0 | **Type**: AI Integration

Model Context Protocol (MCP) tools for AI agent capabilities and system integration.

#### Core Tools

##### FileTool
- **Purpose**: File system operations
- **Features**: Read, write, delete, list files
- **Security**: Sandboxed file access

##### ShellTool
- **Purpose**: Command execution
- **Features**: Safe shell command running
- **Security**: Controlled command whitelist

##### LogTool
- **Purpose**: Log analysis and monitoring
- **Features**: Parse, filter, analyze logs
- **Integration**: System log monitoring

#### Dependencies
```json
{
  "dependencies": {
    "@repo/types": "workspace:*"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "typescript": "5.9.3",
    "vitest": "^2.1.8"
  }
}
```

#### Usage Example
```typescript
import { FileTool, ShellTool, LogTool } from '@repo/mcp-tools'

const fileTool = new FileTool()
const shellTool = new ShellTool()
const logTool = new LogTool()

// AI agent integration
await fileTool.execute({ action: 'read', path: '/path/to/file' })
await shellTool.execute({ command: 'ls -la' })
await logTool.execute({ action: 'analyze', log: 'application.log' })
```

### `@repo/operone`
**Version**: 0.0.0 | **Type**: Core AI Engine

The heart of Operone's AI capabilities - reasoning engine, memory management, and model provider abstraction.

#### Core Components

##### MemoryManager
- **Short-term Memory**: Session-based context
- **Long-term Memory**: Persistent knowledge storage
- **Vector Storage**: Embedding-based retrieval

##### ModelProvider System
```typescript
// Unified interface for all AI providers
interface ModelProvider {
  generate(prompt: string, options?: GenerateOptions): Promise<string>
  stream(prompt: string, options?: StreamOptions): AsyncGenerator<string>
  embed(text: string): Promise<number[]>
}

// Support for multiple providers
- OpenAI (GPT-3.5, GPT-4, GPT-4-turbo)
- Anthropic (Claude family)
- Google (Gemini)
- Mistral (Mistral models)
- Ollama (Local models)
- Custom endpoints
```

##### StreamHandler
- **Real-time Streaming**: Live AI response streaming
- **Chunk Processing**: Efficient token handling
- **Error Recovery**: Robust error management

##### Agent System
```typescript
// Assistant Agent - AI conversation partner
class AssistantAgent {
  async generateResponse(message: string): Promise<string>
}

// OS Agent - System operations
class OSAgent {
  async execute(command: string): Promise<string>
}

// RAG Engine - Document retrieval
class RAGEngine {
  async ingestDocument(id: string, content: string): Promise<void>
  async query(query: string, topK?: number): Promise<any[]>
}
```

##### Reasoning Engine
- **Planning**: Goal decomposition and step planning
- **Decision Making**: Context-aware choices
- **Tool Selection**: Dynamic tool usage

#### Dependencies
```json
{
  "dependencies": {
    "@ai-sdk/anthropic": "^2.0.45",
    "@ai-sdk/google": "^1.0.11",
    "@ai-sdk/mistral": "^1.0.9",
    "@ai-sdk/openai": "^2.0.71",
    "@repo/mcp-tools": "workspace:*",
    "@repo/types": "workspace:*",
    "ai": "^5.0.100",
    "better-sqlite3": "^12.4.6",
    "zod": "^3.23.8"
  }
}
```

#### Usage Examples

##### Basic AI Generation
```typescript
import { ModelProvider, createDefaultConfig } from '@repo/operone'

const provider = new ModelProvider(createDefaultConfig({
  type: 'openai',
  model: 'gpt-4',
  apiKey: process.env.OPENAI_API_KEY
}))

const response = await provider.generate({
  prompt: 'Explain quantum computing',
  maxTokens: 1000
})
```

##### Memory Management
```typescript
import { MemoryManager } from '@repo/operone'

const memory = new MemoryManager()
await memory.store('User prefers TypeScript over JavaScript')
const context = await memory.query('What programming language does the user prefer?')
```

##### RAG System
```typescript
import { RAGEngine, MemoryManager } from '@repo/operone'

const rag = new RAGEngine(memory, embeddingModel)
await rag.ingestDocument('doc1', 'Quantum computing uses quantum bits...')
const results = await rag.query('What are qbits?', 3)
```

##### Streaming Responses
```typescript
import { StreamHandler } from '@repo/operone'

const stream = new StreamHandler(provider)
for await (const chunk of stream.generate(prompt)) {
  console.log(chunk) // Real-time output
}
```

---

## 🔄 Package Dependencies

### Dependency Graph
```
@repo/types (base types)
├── @repo/mcp-tools (depends on types)
├── @repo/operone (depends on types, mcp-tools)
└── Applications (depend on all packages)

@repo/eslint-config (standalone dev tool)
└── Used by all packages for linting

@repo/typescript-config (standalone dev tool)
└── Used by all packages for TS config
```

### Internal Dependencies
- **No Circular Dependencies**: Clean dependency hierarchy
- **Workspace Protocol**: Uses `workspace:*` for internal packages
- **Version Locking**: Synchronized versions across packages

### External Dependencies
- **AI SDKs**: Multiple provider support (@ai-sdk/*)
- **Database**: SQLite for local storage (better-sqlite3)
- **Validation**: Schema validation (zod)
- **Testing**: Vitest for unit testing

---

## 🚀 Package Development

### Common Scripts
All packages share these npm scripts:
```bash
pnpm lint           # ESLint checking
pnpm check-types    # TypeScript compilation
pnpm test           # Run tests
pnpm test:watch     # Watch mode testing
pnpm test:coverage  # Coverage reports
```

### Development Workflow
1. **Make Changes**: Edit package source code
2. **Run Tests**: `pnpm test` in package directory
3. **Type Check**: `pnpm check-types`
4. **Lint**: `pnpm lint`
5. **Build**: `pnpm build` from root

### Publishing
- **Private Packages**: All packages are `private: true`
- **Workspace Only**: Distributed within monorepo
- **Version Management**: Using Changesets for versioning

---

## 🧪 Testing Strategy

### Unit Testing
- **Framework**: Vitest
- **Coverage**: Target 80%+ coverage
- **Mock Strategy**: External dependencies mocked

### Integration Testing
- **Package Interactions**: Test package dependencies
- **AI Model Mocking**: Mock AI responses for testing
- **Database Testing**: In-memory SQLite for tests

### Test Structure
```
packages/*/src/
├── *.ts              # Source files
├── *.test.ts         # Unit tests
├── *.integration.ts  # Integration tests
└── __mocks__/        # Mock files
```

---

## 🔮 Future Package Roadmap

### Planned Packages
1. **@repo/ui** - Shared UI components
2. **@repo/database** - Database utilities
3. **@repo/auth** - Authentication helpers
4. **@repo/storage** - File storage abstraction
5. **@repo/monitoring** - Metrics and logging

### Enhancement Areas
- **Performance**: Optimized bundle sizes
- **Security**: Enhanced security patterns
- **Documentation**: API documentation generation
- **Testing**: E2E test coverage

---

## 📚 Usage Guidelines

### Import Patterns
```typescript
// Preferred: Specific imports
import { MemoryManager } from '@repo/operone'
import { Agent } from '@repo/types'

// Avoid: Namespace imports (larger bundles)
import * as Operone from '@repo/operone'
```

### Version Compatibility
- **Major Version**: Breaking changes
- **Minor Version**: New features, backward compatible
- **Patch Version**: Bug fixes only

### Best Practices
1. **Type Safety**: Use @repo/types for all shared interfaces
2. **Error Handling**: Proper error propagation
3. **Testing**: Write tests for new functionality
4. **Documentation**: Update docs for API changes

---

## 🐛 Troubleshooting

### Common Issues

#### TypeScript Errors
```bash
# Clear TypeScript cache
pnpm store prune
rm -rf .turbo
pnpm install
```

#### Dependency Conflicts
```bash
# Update workspace dependencies
pnpm update --recursive
```

#### Test Failures
```bash
# Run tests with verbose output
pnpm test --reporter=verbose
```

### Getting Help
- **Package Issues**: Check package-specific documentation
- **Integration Problems**: Review dependency graph
- **Build Failures**: Check TypeScript configuration

---

## 📄 Package Licenses

All packages are licensed under the MIT License, consistent with the main project license.

---

**Last Updated**: November 2025  
**Maintainers**: Operone Development Team
