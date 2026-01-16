import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // Check for Azure OpenAI credentials
    const azureApiKey = process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_KEY;
    const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT || process.env.AZURE_LANGUAGE_ENDPOINT;
    const azureDeployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o"; // Default deployment name if not specified

    // Check for standard OpenAI credentials
    const openAiApiKey = process.env.OPENAI_API_KEY;

    let reply = "";

    if (azureApiKey && azureEndpoint && azureDeployment) {
      // Use Azure OpenAI
      const client = new OpenAI({
        apiKey: azureApiKey,
        baseURL: `${azureEndpoint}/openai/deployments/${azureDeployment}`,
        defaultQuery: { 'api-version': '2023-05-15' },
        defaultHeaders: { 'api-key': azureApiKey }
      });

      const completion = await client.chat.completions.create({
        messages: [
          { role: "system", content: "You are Nexus AI, a helpful and intelligent assistant for the Nexus platform. You speak Uzbek fluently. You are helpful, friendly, and knowledgeable about technology, education, and entertainment." },
          ...history.map((msg: any) => ({ role: msg.role, content: msg.content })),
          { role: "user", content: message }
        ],
        model: azureDeployment, // In Azure, model name is often the deployment name
      });
      
      reply = completion.choices[0].message.content || "";

    } else if (openAiApiKey) {
      // Use Standard OpenAI
      const client = new OpenAI({
        apiKey: openAiApiKey,
      });

      const completion = await client.chat.completions.create({
        messages: [
          { role: "system", content: "You are Nexus AI, a helpful and intelligent assistant for the Nexus platform. You speak Uzbek fluently. You are helpful, friendly, and knowledgeable about technology, education, and entertainment." },
          ...history.map((msg: any) => ({ role: msg.role, content: msg.content })),
          { role: "user", content: message }
        ],
        model: "gpt-3.5-turbo",
      });

      reply = completion.choices[0].message.content || "";

    } else {
      // Fallback/Demo mode
      await new Promise(resolve => setTimeout(resolve, 1000));
      const responses = [
        "Bu juda qiziqarli savol! Nexus AI hozircha demo rejimida ishlamoqda, lekin tez orada to'liq aqlga ega bo'ladi.",
        "Sizning fikringiz muhim. Menimcha, bu borada ko'proq izlanish kerak.",
        "Ajoyib! Buni eshitganimdan xursandman.",
        "Kechirasiz, men hozircha faqat cheklangan bilimga egaman. Lekin o'rganishda davom etyapman!",
        "Bu mavzu bo'yicha batafsil ma'lumotni bizning kutubxonamizdan topishingiz mumkin.",
        "Azure yoki OpenAI kalitlari o'rnatilmaganligi sababli men demo rejimdaman."
      ];
      reply = responses[Math.floor(Math.random() * responses.length)];
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Copilot API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', reply: "Uzr, serverda xatolik yuz berdi." },
      { status: 500 }
    );
  }
}
