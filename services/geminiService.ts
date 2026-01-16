
import { GoogleGenAI } from "@google/genai";
import { Task, TaskStatus } from "../types";

export const getAIProductivityFeedback = async (tasks: Task[]) => {
  // Always use {apiKey: process.env.API_KEY} for initialization as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const completed = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const total = tasks.length;
  
  const taskSummary = tasks.map(t => 
    `- [${t.status}] ${t.description} (${t.hours}h). Reason for failure: ${t.reason || 'None specified'}`
  ).join('\n');

  const prompt = `You are a strict but high-performance mentor for a student. Your persona is "The SuperPower Mentor". 
  Evaluate their day based on these tasks:
  Total Tasks: ${total}
  Completed: ${completed}
  
  Tasks List:
  ${taskSummary}
  
  Respond in Roman Urdu (Urdu written in Latin script). 
  BE VERY FIRM AND MENTOR-LIKE. If they missed tasks, be disappointed but motivational. 
  Remind them that their parents are waiting for their success and time is running out. 
  Talk about using their "Brain as a Weapon". 
  Keep the feedback concise, powerful, and under 100 words.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // response.text is a property, not a method
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Feedback system offline. Stay focused, commander.";
  }
};
