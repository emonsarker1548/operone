import * as React from "react"
import { useCallback, useMemo } from "react"
import { Paperclip, Mic } from "lucide-react"

import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputModelSelector,
  type ModelInfo,
  type ModelCategory,
} from "@/components/ai/prompt-input"
import { useModelDetector } from "@/contexts"
import type { ChatStatus } from "ai"

// Types
interface ChatPromptInputProps {
  input: string;
  setInput: (value: string) => void;
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  onSubmit: (message: { text: string; files: any[] }, event: React.FormEvent<HTMLFormElement>) => void;
  status: ChatStatus;
}


// Optimized ChatPromptInput Component with memoization
export const ChatPromptInput = React.memo(function ChatPromptInput({
  input,
  setInput,
  selectedModel,
  setSelectedModel,
  onSubmit,
  status,
}: ChatPromptInputProps) {
  const { availableModels } = useModelDetector();

  const handleSubmit = useCallback((message: { text: string; files: any[] }, event: React.FormEvent<HTMLFormElement>) => {
    onSubmit(message, event);
  }, [onSubmit]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.currentTarget.value);
  }, [setInput]);

  // Transform available models to ModelInfo format
  const transformedModels = useMemo(() => {
    return availableModels.map((model: any): ModelInfo => {
      // Determine category based on model name/description
      let category: ModelCategory = "text";
      const name = model.name?.toLowerCase() || model.id?.toLowerCase() || "";
      const description = model.description?.toLowerCase() || "";
      
      if (name.includes("dall-e") || name.includes("midjourney") || name.includes("stable diffusion") || 
          name.includes("image") || description.includes("image")) {
        category = "image";
      } else if (name.includes("whisper") || name.includes("tts") || name.includes("audio") || 
                 description.includes("audio") || description.includes("speech")) {
        category = "audio";
      } else if (name.includes("video") || description.includes("video")) {
        category = "video";
      } else if (name.includes("gpt-4") || name.includes("claude") || name.includes("gemini") || 
                 name.includes("multimodal") || description.includes("vision") || description.includes("image analysis")) {
        category = "multimodal";
      } else if (name.includes("codex") || name.includes("code") || name.includes("copilot") || 
                 description.includes("code") || description.includes("programming")) {
        category = "code";
      }
      
      const isPremium = model.provider !== 'ollama';
      const isNew = model.isNew || false;
      
      return {
        id: model.id,
        name: model.name || model.id,
        category,
        description: model.description,
        provider: model.provider,
        isPremium,
        isNew,
      };
    });
  }, [availableModels]);

  return (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputTextarea
        value={input}
        onChange={handleInputChange}
        placeholder="Type your message..."
        className="resize-none"
        rows={1}
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
          <PromptInputModelSelector
            models={transformedModels}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            maxContentHeight="200px"
            maxContentWidth="200px"
            showCategories={true}
            allowSorting={true}
            className="min-w-[120px]"
          />
        </PromptInputTools>
        <PromptInputSubmit disabled={!input.trim()} status={status} />
      </PromptInputFooter>
    </PromptInput>
  );
});
