
import { GoogleGenAI } from "@google/genai";
import { Task, TaskStatus } from "../types";

export const getAIProductivityFeedback = async (tasks: Task[]) => {
  // Use named parameter for API Key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const completed = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const total = tasks.length;
  
  const taskSummary = tasks.map(t => 
    `- [${t.status}] ${t.description} (${t.hours}h). Reason: ${t.reason || 'N/A'}`
  ).join('\n');

  const prompt = `You are "The SuperPower Mentor" for Rayyan. 
  Evaluate today's performance:
  Total Tasks: ${total}
  Completed: ${completed}
  
  Task Data:
  ${taskSummary}
  
  Respond in Roman Urdu (Latin script). 
  PERSONA: Disappointed but extremely motivational.
  MESSAGE: Rayyan, you MUST provide that Villa and Rolls Royce for your parents soon. 
  Time is limited. Use your brain as a weapon.
  Keep it under 80 words, sharp and lethal.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    // Use .text property directly
    return response?.text || "Mission data processed. Keep moving, Commander.";
  } catch (error) {
    console.error("AI Logic Error:", error);
    return "AI Uplink Interrupted. Remember your parents' dreams. Stay on the path.";
  }
};
