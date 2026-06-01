import { GoogleGenAI } from "@google/genai";
import { Web3Project } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function summarizeProject(project: Partial<Web3Project>) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Summarize this Web3 project and provide a trust score (0-100) and any potential scam signals. 
    Project Name: ${project.name}
    Description: ${project.description}
    Category: ${project.category}
    
    Return the response in JSON format:
    {
      "summary": "...",
      "trustScore": 85,
      "scamSignals": ["..."]
    }`,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function performShelbyVerification(project: Web3Project) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Perform a 'Shelby Infrastructure' data verification for this Web3 project. 
    Verify the legitimacy, check for common red flags, and provide an audit report.
    Project: ${JSON.stringify(project)}
    
    Return JSON:
    {
      "isVerified": true/false,
      "auditReport": "...",
      "score": 0-100
    }`,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function getAiAssistantResponse(message: string, context: Web3Project[]) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are AetherAI, a Web3 discovery assistant. 
    Context of current projects: ${JSON.stringify(context.slice(0, 5))}
    User question: ${message}`,
    config: {
      systemInstruction: "Be concise, helpful, and focus on Web3 opportunities. If asked for recommendations, use the provided context."
    }
  });

  return response.text;
}
