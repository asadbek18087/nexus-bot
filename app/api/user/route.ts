import { NextRequest, NextResponse } from 'next/server';

// Mock Data
const mockUsers = new Map();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const telegramId = searchParams.get('telegramId');
    
    if (!telegramId) {
      return NextResponse.json({ error: 'Telegram ID required' }, { status: 400 });
    }

    // Mock user
    const user = {
      id: 1,
      telegram_id: telegramId,
      username: 'QuantumUser',
      full_name: 'Quantum User',
      photo_url: null,
      subscription_type: 1,
      referral_code: 'NEXUS123'
    };

    const stats = {
      level: 5,
      xp: 2500,
      gold: 1500,
      energy: 80,
      max_energy: 100,
      crystals: 10,
      streak_count: 3,
      total_referrals: 5,
      total_downloads: 12,
      quiz_score: 450,
      battle_score: 300,
      mining_level: 2,
      rank: 'Silver'
    };

    const achievements = [
      { id: 'first_login', name: 'First Step', description: 'Login for the first time' }
    ];

    const dailyBonus = {
        available: true,
        nextClaimTime: new Date().toISOString(),
        streak: 3,
        lastClaim: new Date().toISOString()
    };

    return NextResponse.json({
      user: { ...user, ...stats }, // Flatten for frontend if needed or keep structure
      stats, // explicit stats
      achievements,
      dailyBonus,
      success: true
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { telegramId, updateData } = body;

    if (!telegramId || !updateData) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    return NextResponse.json({ success: true, changes: 1 });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
