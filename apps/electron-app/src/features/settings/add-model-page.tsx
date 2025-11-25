"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusIcon, ArrowLeftIcon, CheckIcon, Loader2Icon } from "lucide-react";
import { useAI } from "@/contexts/ai-context";
import type { ProviderConfig, ProviderType } from "@repo/types";
import { OllamaDetector, type OllamaModel } from "@/utils/ollama-detector";

export function AddModelPage() {
  const navigate = useNavigate();
  const { addProvider } = useAI();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Form state
  const [providerType, setProviderType] = useState<ProviderType>("openai");
  const [providerName, setProviderName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [baseURL, setBaseURL] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  
  // Ollama detection state
  const [ollamaDetector] = useState(() => OllamaDetector.getInstance());
  const [isDetectingOllama, setIsDetectingOllama] = useState(false);
  const [ollamaAvailable, setOllamaAvailable] = useState(false);
  const [ollamaModels, setOllamaModels] = useState<OllamaModel[]>([]);

  // Detect Ollama when provider type changes to ollama
  useEffect(() => {
    if (providerType === "ollama") {
      detectOllama();
    }
  }, [providerType]);

  const detectOllama = async () => {
    setIsDetectingOllama(true);
    try {
      const isAvailable = await ollamaDetector.checkAvailability();
      setOllamaAvailable(isAvailable);
      
      if (isAvailable) {
        const models = await ollamaDetector.getAvailableModels();
        setOllamaModels(models);
        if (models.length > 0 && !selectedModel) {
          setSelectedModel(models[0]?.name || "");
        }
      }
    } catch (error) {
      console.error("Failed to detect Ollama:", error);
      setOllamaAvailable(false);
    } finally {
      setIsDetectingOllama(false);
    }
  };

  const getProviderDefaults = (type: ProviderType) => {
    switch (type) {
      case "openai":
        return { baseURL: "https://api.openai.com/v1", name: "OpenAI" };
      case "anthropic":
        return { baseURL: "https://api.anthropic.com", name: "Anthropic" };
      case "google":
        return { baseURL: "https://generativelanguage.googleapis.com/v1", name: "Google" };
      case "ollama":
        return { baseURL: "http://localhost:11434", name: "Ollama" };
      default:
        return { baseURL: "", name: "" };
    }
  };

  useEffect(() => {
    const defaults = getProviderDefaults(providerType);
    setBaseURL(defaults.baseURL);
    if (!providerName) {
      setProviderName(defaults.name);
    }
  }, [providerType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerName.trim()) return;

    setIsLoading(true);
    try {
      const providerId = `${providerType}-${providerName.toLowerCase().replace(/\s+/g, "-")}`;
      
      let config: ProviderConfig;
      
      switch (providerType) {
        case "openai":
          config = {
            type: "openai",
            apiKey: apiKey || undefined,
            baseURL: baseURL || undefined,
            model: selectedModel || "gpt-4o",
          };
          break;
        case "anthropic":
          config = {
            type: "anthropic",
            apiKey: apiKey || undefined,
            baseURL: baseURL || undefined,
            model: selectedModel || "claude-3-5-sonnet-20241022",
          };
          break;
        case "google":
          if (!apiKey) {
            throw new Error("API key is required for Google provider");
          }
          config = {
            type: "google",
            apiKey,
            baseURL: baseURL || undefined,
            model: selectedModel || "gemini-pro",
          };
          break;
        case "openrouter":
          if (!apiKey) {
            throw new Error("API key is required for OpenRouter provider");
          }
          config = {
            type: "openrouter",
            apiKey,
            baseURL: baseURL || undefined,
            model: selectedModel || "anthropic/claude-3.5-sonnet",
          };
          break;
        case "mistral":
          if (!apiKey) {
            throw new Error("API key is required for Mistral provider");
          }
          config = {
            type: "mistral",
            apiKey,
            baseURL: baseURL || undefined,
            model: selectedModel || "mistral-large-latest",
          };
          break;
        case "ollama":
          config = {
            type: "ollama",
            baseURL: baseURL || "http://localhost:11434",
            model: selectedModel || ollamaModels[0]?.name || "",
          };
          break;
        default:
          throw new Error(`Unsupported provider type: ${providerType}`);
      }

      await addProvider(providerId, config);
      setIsSaved(true);
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate("/chat");
      }, 1500);
    } catch (error) {
      console.error("Failed to add provider:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate("/chat")}>
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Chat
        </Button>
        <h1 className="text-2xl font-bold">Add AI Model</h1>
      </div>

      {isSaved && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckIcon className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Model added successfully! Redirecting to chat...
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="providerType">Provider Type</Label>
            <Select value={providerType} onValueChange={(value: ProviderType) => setProviderType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select provider type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="ollama">Ollama (Local)</SelectItem>
                <SelectItem value="openrouter">OpenRouter</SelectItem>
                <SelectItem value="mistral">Mistral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="providerName">Provider Name</Label>
            <Input
              id="providerName"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder="e.g., My OpenAI"
              required
            />
          </div>

          {providerType !== "ollama" && (
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={providerType === "openai" ? "sk-..." : "your-api-key"}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="baseURL">Base URL</Label>
            <Input
              id="baseURL"
              value={baseURL}
              onChange={(e) => setBaseURL(e.target.value)}
              placeholder="API base URL"
            />
          </div>

          {/* Ollama specific section */}
          {providerType === "ollama" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Ollama Status</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={detectOllama}
                  disabled={isDetectingOllama}
                >
                  {isDetectingOllama ? (
                    <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <PlusIcon className="w-4 h-4 mr-2" />
                  )}
                  Detect
                </Button>
              </div>

              {ollamaAvailable && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckIcon className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Ollama is running and {ollamaModels.length} models detected
                  </AlertDescription>
                </Alert>
              )}

              {ollamaModels.length > 0 && (
                <div className="space-y-2">
                  <Label>Available Models</Label>
                  <div className="grid gap-2">
                    {ollamaModels.map((model) => (
                      <div
                        key={model.name}
                        className="flex items-center justify-between p-3 border rounded-full cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedModel(model.name)}
                      >
                        <div>
                          <div className="font-medium">{model.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {model.details.family} • {model.details.parameter_size} • {model.details.quantization_level}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{model.size}</Badge>
                          {selectedModel === model.name && (
                            <CheckIcon className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Default model selection for non-Ollama providers */}
          {providerType !== "ollama" && (
            <div className="space-y-2">
              <Label htmlFor="model">Default Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select default model" />
                </SelectTrigger>
                <SelectContent>
                  {providerType === "openai" && (
                    <>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </>
                  )}
                  {providerType === "anthropic" && (
                    <>
                      <SelectItem value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</SelectItem>
                      <SelectItem value="claude-3-haiku-20240307">Claude 3 Haiku</SelectItem>
                    </>
                  )}
                  {providerType === "google" && (
                    <>
                      <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                      <SelectItem value="gemini-pro-vision">Gemini Pro Vision</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading || !providerName.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <PlusIcon className="w-4 h-4 mr-2" />
              )}
              Add Model
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/chat")}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
