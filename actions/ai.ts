"use server";

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function chatWithAI(message: string) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return "AI Neural Link is offline (API Key missing). Please contact the administrator.";
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are an advanced AI Mentor for the Nexus ecosystem. Your goal is to help users learn, grow, and navigate the platform. Be concise, helpful, and futuristic in tone." },
        { role: "user", content: message }
      ],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content || "I am unable to process that request at the moment.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Connection to Neural Network interrupted. Please try again later.";
  }
}
