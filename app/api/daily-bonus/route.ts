import { NextRequest, NextResponse } from 'next/server';

// Mock Data
const mockDailyHistory = new Map();
const mockUserStats = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { telegramId } = body;

    if (!telegramId) {
      return NextResponse.json({ error: 'Telegram ID required' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];
    const key = `${telegramId}_${today}`;

    if (mockDailyHistory.has(key)) {
      return NextResponse.json({ 
        error: 'Daily bonus already claimed today',
        nextClaimTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
      }, { status: 400 });
    }

    mockDailyHistory.set(key, true);

    // Mock stats update
    const currentStats = mockUserStats.get(telegramId) || { gold: 100, xp: 0, level: 1, energy: 100, crystals: 0, streak: 1 };
    const bonus = {
      type: 'gold',
      amount: 100 + (currentStats.streak * 5)
    };

    const newStats = {
      ...currentStats,
      gold: currentStats.gold + bonus.amount,
      streak: currentStats.streak + 1
    };
    mockUserStats.set(telegramId, newStats);

    return NextResponse.json({
      success: true,
      reward: bonus,
      newStats,
      nextClaimTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
    });

  } catch (error) {
    console.error('Error in daily bonus API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const telegramId = searchParams.get('telegramId');

    if (!telegramId) {
      return NextResponse.json({ error: 'Telegram ID required' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];
    const key = `${telegramId}_${today}`;
    const claimed = mockDailyHistory.has(key);

    return NextResponse.json({
      canClaim: !claimed,
      nextClaimTime: claimed ? new Date(new Date().setDate(new Date().getDate() + 1)).toISOString() : new Date().toISOString(),
      streak: (mockUserStats.get(telegramId)?.streak || 1),
      success: true
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
