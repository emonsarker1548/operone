import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Sparkles } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAI } from "@/contexts/ai-context";
import { useModelDetector } from "@/contexts/model-context";
import type { FileUIPart, ChatStatus } from "ai";
import type { ChatMessage, Chat } from "@repo/types";

// AI Component Imports
import { ChatPromptInput } from "./prompt-input";
import { Message, MessageContent, MessageLoading } from "@/components/ai/message";
import { Shimmer } from "@/components/ai/shimmer";
import { ReasoningStepsDisplay, type ReasoningStep } from "@/components/ai/reasoning-steps";
import type { ChatMode } from "@/components/ai/chat-mode-selector";
import {
  ChatLayout as ChatLayoutContainer,
  ChatMain,
  ChatContent,
  ChatMessages,
  ChatMessagesContainer,
  ChatInputContainer,
  ChatEmptyState,
  ChatMessageList,
  ChatStatusBar
} from "./chat-layout";

// Chat Layout Props Interface
interface ChatLayoutProps {
  className?: string;
}


// Main Chat Component using structured layout
export const ChatLayout = React.memo(function ChatLayout({
  className
}: ChatLayoutProps) {
  const {
    messages,
    sendMessageStreaming,
    isLoading,
    streamingMessage,
    setMessages
  } = useAI();

  // Simple local state for chat management (replacing project context)
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);

  const updateChat = useCallback((chatId: string, updates: Partial<Chat>) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, ...updates } : chat
    ));
    if (currentChat?.id === chatId) {
      setCurrentChat(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [currentChat]);

  const getChatById = useCallback((chatId: string) => {
    return chats.find(chat => chat.id === chatId);
  }, [chats]);

  const generateChatTitle = useCallback((chatId: string, messages: ChatMessage[]) => {
    // Simple title generation - take first message content and truncate
    const firstMessage = messages.find(m => m.role === 'user');
    if (firstMessage && firstMessage.content) {
      const title = firstMessage.content.slice(0, 30) + (firstMessage.content.length > 30 ? '...' : '');
      updateChat(chatId, { title });
    }
  }, [updateChat]);

  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [chatStatus, setChatStatus] = useState<ChatStatus>("ready");
  const [chatMode, setChatMode] = useState<ChatMode>("chat");
  const [reasoningSteps, setReasoningSteps] = useState<ReasoningStep[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();

  // Load chat from URL params or use current chat
  useEffect(() => {
    const chatId = searchParams.get('chatId');

    if (chatId && chatId !== currentChat?.id) {
      const chat = getChatById(chatId);
      if (chat) {
        setCurrentChat(chat);
        // Ensure messages have required timestamp property
        const messagesWithTimestamp = (chat.messages || []).map(msg => ({
          ...msg,
          timestamp: msg.timestamp || new Date()
        }));
        setMessages(messagesWithTimestamp);
      }
    } else if (currentChat) {
      // Ensure messages have required timestamp property
      const messagesWithTimestamp = (currentChat.messages || []).map(msg => ({
        ...msg,
        timestamp: msg.timestamp || new Date()
      }));
      setMessages(messagesWithTimestamp);
    }
  }, [searchParams, currentChat?.id, getChatById, setMessages]);

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

  // Generate chat title when messages are available and chat doesn't have a proper title
  useEffect(() => {
    if (currentChat && messages.length > 0 && currentChat.title === 'New Chat') {
      generateChatTitle(currentChat.id, messages);
    }
  }, [messages, currentChat, generateChatTitle]);

  // Auto-select Ollama model if available and no model selected
  const { availableModels } = useModelDetector();

  useEffect(() => {
    if (!selectedModel && availableModels.length > 0) {
      // Find Ollama models within the available models list
      const ollamaOptions = availableModels.filter(m => m.provider === 'ollama');

      if (ollamaOptions.length > 0) {
        // Prefer llama3.2, otherwise take the first one
        const defaultModel = ollamaOptions.find(m => m.name.includes('llama3.2')) || ollamaOptions[0];
        if (defaultModel) {
          setSelectedModel(defaultModel.id);
        }
      }
    }
  }, [selectedModel, availableModels]);

  // Update chat messages in project context
  useEffect(() => {
    if (currentChat && messages.length > 0) {
      updateChat(currentChat.id, {
        messages: messages,
        updatedAt: new Date()
      });
    }
  }, [messages, currentChat, updateChat]);

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

  // Listen for agent events to populate reasoning steps
  useEffect(() => {
    if (!window.electronAPI?.ai?.onAgentEvent) return;
    if (chatMode === 'chat') return; // Only listen in agentic/planning modes

    const cleanup = window.electronAPI.ai.onAgentEvent((payload: any) => {
      // Handle reasoning events
      if (payload.topic === 'reasoning' && payload.event) {
        const eventType = payload.event.split(':')[1]; // e.g., 'step:think' -> 'think'

        if (eventType === 'think' || eventType === 'act' || eventType === 'observe') {
          const step: ReasoningStep = {
            type: eventType as 'think' | 'act' | 'observe',
            content: payload.data?.content || payload.data?.output || '',
            timestamp: Date.now(),
            status: 'completed',
          };

          setReasoningSteps(prev => [...prev, step]);
        }
      }
    });

    return cleanup;
  }, [chatMode]);

  // Clear reasoning steps when starting new message
  useEffect(() => {
    if (isLoading && chatMode !== 'chat') {
      setReasoningSteps([]);
    }
  }, [isLoading, chatMode]);

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
    return null;
  }, []);

  // Memoized message count display with shadcn typography
  const messageCountDisplay = useMemo(() => (
    <span className="text-sm text-muted-foreground">{messages.length} messages</span>
  ), [messages.length]);

  return (
    <ChatLayoutContainer className={cn("h-full", className)}>
      <ChatMain>
        <ChatContent>
          <ChatMessages>
            <ChatMessagesContainer>
              {messages.length === 0 ? (
                <ChatEmptyState
                  icon={<Sparkles className="w-5 h-5 text-primary-foreground" />}
                  actions={
                    suggestionButtons.map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        {suggestion}
                      </Button>
                    ))
                  }
                />
              ) : (
                <ChatMessageList>
                  {transformedMessages.map((message) => (
                    <Message key={message.id} from={message.role}>
                      <MessageContent>
                        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                          {message.content}
                        </div>
                      </MessageContent>
                    </Message>
                  ))}
                </ChatMessageList>
              )}

              {/* Show reasoning steps in agentic/planning modes */}
              {(chatMode === 'agentic' || chatMode === 'planning') && reasoningSteps.length > 0 && (
                <div className="px-4 py-2">
                  <ReasoningStepsDisplay steps={reasoningSteps} />
                </div>
              )}

              {/* Optimized loading indicator */}
              <MessageLoading
                isLoading={isLoading}
                streamingMessage={streamingMessage || undefined}
              />

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

              <div ref={scrollRef} />
            </ChatMessagesContainer>
          </ChatMessages>

          <ChatInputContainer>
            <ChatStatusBar status={statusDisplay} messageCount={messageCountDisplay} />
            <ChatPromptInput
              input={input}
              setInput={setInput}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              onSubmit={handleSubmit}
              status={chatStatus}
              chatMode={chatMode}
              onChatModeChange={setChatMode}
            />
          </ChatInputContainer>
        </ChatContent>
      </ChatMain>
    </ChatLayoutContainer>
  );
});

export default function Chat() {
  return <ChatLayout />;
}

