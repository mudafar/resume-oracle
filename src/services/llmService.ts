import { initChatModel } from "langchain/chat_models/universal";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { LLMConfig } from "@/types/store";
import { IterableReadableStream } from "@langchain/core/utils/stream";

// Get the return type of initChatModel for proper typing
type InitChatModelReturn = Awaited<ReturnType<typeof initChatModel>>;

// interface LLMConfig {
//   provider?: string;
//   variant?: string;
//   apiKey?: string;
//   endpointUrl?: string;
//   temperature?: number;
//   topP?: number;
// }

export class LLMService {
  /**
   * Service for managing LLM interactions with Google Gemini provider
   */

  private defaultProvider = "google-genai";
  private defaultModel = "gemini-2.5-flash-lite";

  private async iniLLM(config?: LLMConfig) {
    /**
     * Initialize LLM based on provider
     * If config is not provided or provider is 'free', use environment API key
     */
    try {
      // Handle OpenRouter specifically
      if (config?.provider === "openrouter") {
        return new ChatOpenAI({
          model: config.variant || "",
          temperature: config.temperature || 0,
          topP: config.topP || 0.90,
          apiKey: config.apiKey || undefined,
          configuration: {
            baseURL: config.endpointUrl ||"https://openrouter.ai/api/v1",
            defaultHeaders: {
              "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
              "X-Title": "Resume Oracle"
            }
          }
        });
      }

      const isFreeProvider = !config || config.provider === 'free';
      const apiKey = isFreeProvider 
        ? process.env.NEXT_PUBLIC_GEMINI_API_KEY 
        : config?.apiKey;
      const modelProvider = isFreeProvider 
        ? this.defaultProvider 
        : config?.provider || this.defaultProvider;
      const variant = isFreeProvider 
        ? this.defaultModel 
        : config?.variant || this.defaultModel;    
      
      return initChatModel(
        variant,
        {
          modelProvider: modelProvider,
          topP: config?.topP || 0.90,
          temperature: config?.temperature || 0,
          apiKey: apiKey,
          ...(config?.endpointUrl && { baseUrl: config.endpointUrl })
        }
      );
    } catch (error) {
      console.error("[ERROR] Failed to initialize LLM:", error);
      throw new Error(`Failed to initialize LLM: ${error}`);
    }
  }

  async getLLM(config?: LLMConfig) {
    /**
     * Get LLM instance
     */
    return await this.iniLLM(config);
  }

  async withStructuredOutput<T extends z.ZodType>(
    outputSchema: T,
    config?: LLMConfig
  ) {
    /**
     * Get LLM with structured output capability
     */
    const llm = await this.getLLM(config);
    // Use initChatModel return type to handle structured output
    return (llm as InitChatModelReturn).withStructuredOutput(outputSchema);
  }

  async invoke(
    promptTemplate: ChatPromptTemplate,
    inputs: Record<string, any>,
    config?: LLMConfig
  ) {
    /**
     * Invoke LLM with prompt template and inputs
     */
    const llm = await this.getLLM(config);
    const chain = promptTemplate.pipe(llm);
    return await chain.invoke(inputs);
  }

    async invokeWithStructuredOutput<T extends z.ZodType>(
    promptTemplate: ChatPromptTemplate,
    outputSchema: T,
    inputs: Record<string, any>,
    config?: LLMConfig
  ): Promise<z.infer<T>> {
    /**
     * Invoke LLM with prompt template and structured output
     */
  const llm = await this.getLLM(config);
    // Use initChatModel return type to handle structured output
    const chain = promptTemplate.pipe((llm as InitChatModelReturn).withStructuredOutput(outputSchema));
    return await chain.invoke(inputs) as z.infer<T>;
  }

  async streamStructuredOutput<T extends z.ZodType>(
    promptTemplate: ChatPromptTemplate,
    outputSchema: T,
    inputs: Record<string, any>,
    config?: LLMConfig
  ): Promise<IterableReadableStream<z.infer<T>>> {
    /**
     * Stream LLM response with prompt template and structured output
     */
    const llm = await this.getLLM(config);
    // Use initChatModel return type to handle structured output
    const chain = promptTemplate.pipe((llm as InitChatModelReturn).withStructuredOutput(outputSchema));
    return chain.stream(inputs) as Promise<IterableReadableStream<z.infer<T>>>;
  }
}

// Create a singleton instance
export const llmService = new LLMService();