
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { RestaurantData } from "../types";
import { SYSTEM_PROMPT_TEMPLATE } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  public initChat(data: RestaurantData) {
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_PROMPT_TEMPLATE(data),
        temperature: 0.7,
      },
    });
  }

  public async sendMessage(message: string): Promise<string> {
    if (!this.chat) {
      throw new Error("Chat not initialized");
    }

    try {
      const result: GenerateContentResponse = await this.chat.sendMessage({ message });
      return result.text || "Przepraszam, wystąpił problem z połączeniem. Proszę spróbować później.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Przepraszam, nie mogę teraz odpowiedzieć. Proszę o kontakt telefoniczny z restauracją.";
    }
  }

  public async *sendMessageStream(message: string) {
    if (!this.chat) {
      throw new Error("Chat not initialized");
    }

    try {
      const stream = await this.chat.sendMessageStream({ message });
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        yield c.text || "";
      }
    } catch (error) {
      console.error("Gemini Stream Error:", error);
      yield "Przepraszam, wystąpił błąd podczas generowania odpowiedzi.";
    }
  }
}

export const geminiService = new GeminiService();
