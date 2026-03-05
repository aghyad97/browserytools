export interface AIModel {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  inputPricePer1M: number;
  outputPricePer1M: number;
  tier: "flagship" | "balanced" | "fast" | "open";
  multimodal: boolean;
  notes?: string;
}

export const AI_MODELS: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    contextWindow: 128000,
    inputPricePer1M: 2.5,
    outputPricePer1M: 10.0,
    tier: "flagship",
    multimodal: true,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o mini",
    provider: "OpenAI",
    contextWindow: 128000,
    inputPricePer1M: 0.15,
    outputPricePer1M: 0.6,
    tier: "fast",
    multimodal: true,
  },
  {
    id: "o1",
    name: "o1",
    provider: "OpenAI",
    contextWindow: 200000,
    inputPricePer1M: 15.0,
    outputPricePer1M: 60.0,
    tier: "flagship",
    multimodal: false,
    notes: "Reasoning model",
  },
  {
    id: "o3-mini",
    name: "o3-mini",
    provider: "OpenAI",
    contextWindow: 200000,
    inputPricePer1M: 1.1,
    outputPricePer1M: 4.4,
    tier: "fast",
    multimodal: false,
    notes: "Fast reasoning model",
  },
  {
    id: "claude-opus-4-6",
    name: "Claude Opus 4.6",
    provider: "Anthropic",
    contextWindow: 200000,
    inputPricePer1M: 15.0,
    outputPricePer1M: 75.0,
    tier: "flagship",
    multimodal: true,
  },
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    provider: "Anthropic",
    contextWindow: 200000,
    inputPricePer1M: 3.0,
    outputPricePer1M: 15.0,
    tier: "balanced",
    multimodal: true,
  },
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    contextWindow: 200000,
    inputPricePer1M: 0.8,
    outputPricePer1M: 4.0,
    tier: "fast",
    multimodal: true,
  },
  {
    id: "gemini-2-0-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    contextWindow: 1000000,
    inputPricePer1M: 0.1,
    outputPricePer1M: 0.4,
    tier: "fast",
    multimodal: true,
  },
  {
    id: "gemini-2-0-pro",
    name: "Gemini 2.0 Pro",
    provider: "Google",
    contextWindow: 2000000,
    inputPricePer1M: 1.25,
    outputPricePer1M: 5.0,
    tier: "flagship",
    multimodal: true,
  },
  {
    id: "llama-3-3-70b",
    name: "Llama 3.3 70B",
    provider: "Meta (via Groq)",
    contextWindow: 128000,
    inputPricePer1M: 0.59,
    outputPricePer1M: 0.79,
    tier: "open",
    multimodal: false,
  },
  {
    id: "llama-3-1-405b",
    name: "Llama 3.1 405B",
    provider: "Meta (via Together)",
    contextWindow: 128000,
    inputPricePer1M: 3.5,
    outputPricePer1M: 3.5,
    tier: "open",
    multimodal: false,
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral",
    contextWindow: 128000,
    inputPricePer1M: 2.0,
    outputPricePer1M: 6.0,
    tier: "balanced",
    multimodal: false,
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    contextWindow: 64000,
    inputPricePer1M: 0.27,
    outputPricePer1M: 1.1,
    tier: "balanced",
    multimodal: false,
  },
];

export const PROVIDERS = [...new Set(AI_MODELS.map((m) => m.provider))];
export const TIERS: AIModel["tier"][] = ["flagship", "balanced", "fast", "open"];
