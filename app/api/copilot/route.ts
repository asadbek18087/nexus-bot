import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
// Note: In a real app, use process.env.OPENAI_API_KEY
// For this demo, we'll simulate a response if no key is present or just use a mock response to avoid errors if the user hasn't set keys.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
  dangerouslyAllowBrowser: true // Just in case, though this is server side
});

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      // Fallback/Demo mode if no API key is set
      // Return a simulated response
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      
      const responses = [
        "Bu juda qiziqarli savol! Nexus AI hozircha demo rejimida ishlamoqda, lekin tez orada to'liq aqlga ega bo'ladi.",
        "Sizning fikringiz muhim. Menimcha, bu borada ko'proq izlanish kerak.",
        "Ajoyib! Buni eshitganimdan xursandman.",
        "Kechirasiz, men hozircha faqat cheklangan bilimga egaman. Lekin o'rganishda davom etyapman!",
        "Bu mavzu bo'yicha batafsil ma'lumotni bizning kutubxonamizdan topishingiz mumkin."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return NextResponse.json({ reply: randomResponse });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are Nexus AI, a helpful and intelligent assistant for the Nexus platform. You speak Uzbek fluentyl. You are helpful, friendly, and knowledgeable about technology, education, and entertainment." },
        ...history.map((msg: any) => ({ role: msg.role, content: msg.content })),
        { role: "user", content: message }
      ],
      model: "gpt-3.5-turbo",
    });

    return NextResponse.json({ reply: completion.choices[0].message.content });

  } catch (error) {
    console.error('Copilot API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', reply: "Uzr, serverda xatolik yuz berdi." },
      { status: 500 }
    );
  }
}
