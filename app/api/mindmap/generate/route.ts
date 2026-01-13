import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { spendCoins } from '@/actions/economy';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { topic, telegramId } = await request.json();

    // Validate user has enough coins (5 coins for mind map)
    const spendResult = await spendCoins(telegramId, 5);
    if (!spendResult.success) {
      return NextResponse.json({ error: 'Not enough coins' }, { status: 400 });
    }

    // Generate mind map using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a mind map generator. Create a hierarchical mind map structure for the given topic. Return ONLY a JSON object with this format: { \"nodes\": [{ \"id\": \"1\", \"type\": \"default\", \"position\": { \"x\": 250, \"y\": 0 }, \"data\": { \"label\": \"Main Topic\", \"color\": \"#8b5cf6\" } }], \"edges\": [{ \"id\": \"e1-2\", \"source\": \"1\", \"target\": \"2\" }] }"
        },
        {
          role: "user",
          content: `Create a mind map for: ${topic}`
        }
      ],
      temperature: 0.7,
    });

    const mindMapData = JSON.parse(completion.choices[0].message.content || '{}');

    // Save to history
    const user = await prisma.user.findUnique({ where: { telegramId: BigInt(telegramId) } });
    if (user) {
      await prisma.activityHistory.create({
        data: {
          userId: user.id,
          action: 'mindmap_created',
          details: JSON.stringify({ topic })
        }
      });
    }

    return NextResponse.json(mindMapData);
  } catch (error) {
    console.error('Mind map generation error:', error);
    return NextResponse.json({ error: 'Failed to generate mind map' }, { status: 500 });
  }
}
