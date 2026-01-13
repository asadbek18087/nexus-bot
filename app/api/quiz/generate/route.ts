import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { spendCoins } from '@/actions/economy';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text, telegramId } = await request.json();

    // Validate user has enough coins (10 coins for quiz generation)
    const spendResult = await spendCoins(telegramId, 10);
    if (!spendResult.success) {
      return NextResponse.json({ error: 'Not enough coins' }, { status: 400 });
    }

    // Generate quiz using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a quiz generator. Create exactly 5 multiple choice questions based on the provided text. Return ONLY a JSON object with this format: { \"questions\": [{ \"id\": \"1\", \"question\": \"...\", \"options\": [\"A\", \"B\", \"C\", \"D\"], \"correctAnswer\": 0 }] }"
        },
        {
          role: "user",
          content: `Generate quiz questions from this text: ${text.substring(0, 3000)}`
        }
      ],
      temperature: 0.7,
    });

    const quizData = JSON.parse(completion.choices[0].message.content || '{}');

    // Save quiz to user history
    const user = await prisma.user.findUnique({ where: { telegramId: BigInt(telegramId) } });
    if (user) {
      await prisma.activityHistory.create({
        data: {
          userId: user.id,
          action: 'quiz_completed',
          details: JSON.stringify({ textLength: text.length, questionsGenerated: quizData.questions?.length || 0 })
        }
      });
    }

    return NextResponse.json(quizData);
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
  }
}
