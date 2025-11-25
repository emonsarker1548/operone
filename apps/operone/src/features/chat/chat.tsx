"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { 
  Sparkles, Loader2, Mic, Paperclip
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAI } from "@/contexts/ai-context";
import { useModelDetector } from "@/contexts";
import type { FileUIPart, ChatStatus } from "ai";

// AI Component Imports
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputSelect,
  PromptInputSelectTrigger,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectValue,
} from "@/components/ai/prompt-input";
import { Message, MessageContent } from "@/components/ai/message";
import { Shimmer } from "@/components/ai/shimmer";

// Optimized ChatPromptInput Component with memoization
interface ChatPromptInputProps {
  input: string;
  setInput: (value: string) => void;
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  onSubmit: (message: { text: string; files: FileUIPart[] }, event: React.FormEvent<HTMLFormElement>) => void;
  status: ChatStatus;
}

const ChatPromptInput = React.memo(function ChatPromptInput({
  input,
  setInput,
  selectedModel,
  setSelectedModel,
  onSubmit,
  status,
}: ChatPromptInputProps) {
  const { availableModels, isLoading, isOllamaAvailable, getAuthStatus } = useModelDetector();

  const handleSubmit = useCallback((message: { text: string; files: FileUIPart[] }, event: React.FormEvent<HTMLFormElement>) => {
    onSubmit(message, event);
  }, [onSubmit]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.currentTarget.value);
  }, [setInput]);

  const ollamaModels = useMemo(() => 
    availableModels.filter((model: any) => model.provider === 'ollama'),
    [availableModels]
  );

  const cloudModels = useMemo(() => 
    availableModels.filter((model: any) => model.provider !== 'ollama'),
    [availableModels]
  );

  return (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputTextarea
        value={input}
        onChange={handleInputChange}
        placeholder="Type your message..."
        className="resize-none"
        rows={3}
      />
      <PromptInputFooter>
        <PromptInputTools>
          <PromptInputButton variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </PromptInputButton>
          <PromptInputButton variant="ghost" size="sm">
            <Mic className="h-4 w-4" />
            <span className="sr-only">Voice input</span>
          </PromptInputButton>
          <PromptInputSelect
            value={selectedModel}
            onValueChange={setSelectedModel}
            disabled={isLoading}
          >
            <PromptInputSelectTrigger>
              <PromptInputSelectValue>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  availableModels.find((m: any) => m.id === selectedModel)?.name || "Select model"
                )}
              </PromptInputSelectValue>
            </PromptInputSelectTrigger>
            <PromptInputSelectContent>
              {isOllamaAvailable && ollamaModels.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                    Local Models (Ollama)
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-xs text-green-600">Connected</span>
                    </div>
                  </div>
                  {ollamaModels.map((model: any) => (
                    <PromptInputSelectItem key={model.id} value={model.id}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col">
                          <span className="font-medium">{model.name}</span>
                          <span className="text-xs text-muted-foreground">{model.description}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-xs text-green-600">Local</span>
                        </div>
                      </div>
                    </PromptInputSelectItem>
                  ))}
                </>
              )}
              
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                Cloud Models
              </div>
              {cloudModels.map((model: any) => {
                const authStatus = getAuthStatus(model.id);
                return (
                  <PromptInputSelectItem key={model.id} value={model.id}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col">
                        <span className="font-medium">{model.name}</span>
                        <span className="text-xs text-muted-foreground">{model.description}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {authStatus === 'authenticated' && (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-xs text-green-600">Connected</span>
                          </>
                        )}
                        {authStatus === 'pending' && (
                          <>
                            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                            <span className="text-xs text-yellow-600">Auth Required</span>
                          </>
                        )}
                        {authStatus === 'failed' && (
                          <>
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            <span className="text-xs text-red-600">Failed</span>
                          </>
                        )}
                      </div>
                    </div>
                  </PromptInputSelectItem>
                );
              })}
              
              {availableModels.length === 0 && !isLoading && (
                <div className="px-2 py-1.5 text-xs text-muted-foreground text-center">
                  No models available. Start Ollama or configure cloud models.
                </div>
              )}
              
              {!isOllamaAvailable && (
                <div className="px-2 py-1.5 text-xs text-muted-foreground text-center border-t">
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    <span>Ollama not detected. Start Ollama to use local models.</span>
                  </div>
                </div>
              )}
            </PromptInputSelectContent>
          </PromptInputSelect>
        </PromptInputTools>
        <PromptInputSubmit disabled={!input.trim()} status={status} />
      </PromptInputFooter>
    </PromptInput>
  );
});

// Optimized ChatLayout Component with memoization
interface ChatLayoutProps {
  className?: string;
}

export const ChatLayout = React.memo(function ChatLayout({ 
  className
}: ChatLayoutProps) {
  const { 
    messages, 
    sendMessageStreaming, 
    isLoading, 
    streamingMessage, 
    activeProvider 
  } = useAI();
  
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [chatStatus, setChatStatus] = useState<ChatStatus>("ready");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Optimized auto-scroll with useCallback
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, streamingMessage, scrollToBottom]);

  // Update chat status based on loading state
  useEffect(() => {
    if (isLoading) {
      setChatStatus("submitted");
    } else if (streamingMessage) {
      setChatStatus("streaming");
    } else {
      setChatStatus("ready");
    }
  }, [isLoading, streamingMessage]);

  // Memoized submit handler with proper error handling
  const handleSubmit = useCallback(async (message: { text: string; files: FileUIPart[] }) => {
    if (!message.text.trim()) return;
    
    setInput("");
    
    try {
      await sendMessageStreaming(message.text);
    } catch (error) {
      console.error("Failed to send message:", error);
      setChatStatus("error");
    }
  }, [sendMessageStreaming]);

  // Memoized transformed messages with proper typing
  const transformedMessages = useMemo(() => 
    messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
    })),
    [messages]
  );

  // Memoized suggestion buttons with shadcn-friendly labels
  const suggestionButtons = useMemo(() => [
    "Start a conversation",
    "Explain the architecture", 
    "Create a code example",
    "Generate an artifact"
  ], []);

  // Memoized suggestion click handler
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInput(suggestion);
  }, []);

  // Memoized status display with shadcn styling patterns
  const statusDisplay = useMemo(() => {
    if (!activeProvider) return null;
    
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-muted-foreground">Connected to {activeProvider.type}</span>
        <span className="text-muted-foreground/60">•</span>
        <span className="text-muted-foreground">Model: {selectedModel || "Default"}</span>
      </div>
    );
  }, [activeProvider, selectedModel]);

  // Memoized message count display with shadcn typography
  const messageCountDisplay = useMemo(() => (
    <span className="text-sm text-muted-foreground">{messages.length} messages</span>
  ), [messages.length]);

  return (
    <div className={cn("flex flex-col h-screen overflow-hidden bg-background", className)}>
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
                <div className="space-y-6">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6 shadow-lg">
                        <Sparkles className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <h2 className="text-2xl font-semibold mb-3 text-foreground">Start a conversation</h2>
                      <p className="text-muted-foreground mb-6 max-w-sm">
                        Ask me anything! I'm here to help with your questions and tasks.
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {suggestionButtons.map((suggestion) => (
                          <Button
                            key={suggestion}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 pb-4">
                      {transformedMessages.map((message) => (
                        <Message key={message.id} from={message.role}>
                          <MessageContent>
                            <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                              {message.content}
                            </div>
                          </MessageContent>
                        </Message>
                      ))}
                    </div>
                  )}
                  
                  {/* Loading indicator with shadcn styling */}
                  {isLoading && !streamingMessage && (
                    <div className="flex justify-center py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Streaming message with shadcn shimmer */}
                  {streamingMessage && (
                    <div className="flex justify-start">
                      <Message from="assistant">
                        <MessageContent>
                          <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                            {streamingMessage}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Shimmer>Typing...</Shimmer>
                          </div>
                        </MessageContent>
                      </Message>
                    </div>
                  )}
                </div>

                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Input Container with proper scrolling */}
          <div className="flex-shrink-0 border-t border-border bg-background">
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
              {/* Status bar with shadcn typography */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {statusDisplay}
                </div>
                <div className="text-xs text-muted-foreground">
                  {messageCountDisplay}
                </div>
              </div>

              <ChatPromptInput
                input={input}
                setInput={setInput}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                onSubmit={handleSubmit}
                status={chatStatus}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default function Chat() {
  return <ChatLayout />;
}

