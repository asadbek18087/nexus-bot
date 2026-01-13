import { NextRequest, NextResponse } from 'next/server';

// Mock Data
const mockLeaderboard = [
  { username: 'CryptoKing', full_name: 'Crypto King', photo_url: null, xp: 150000, level: 42, gold: 50000, streak_count: 15 },
  { username: 'QuantumQueen', full_name: 'Quantum Queen', photo_url: null, xp: 125000, level: 38, gold: 40000, streak_count: 12 },
  { username: 'NexusMaster', full_name: 'Nexus Master', photo_url: null, xp: 98000, level: 35, gold: 30000, streak_count: 10 },
  { username: 'StarWalker', full_name: 'Star Walker', photo_url: null, xp: 85000, level: 30, gold: 25000, streak_count: 8 },
  { username: 'CyberNinja', full_name: 'Cyber Ninja', photo_url: null, xp: 72000, level: 28, gold: 20000, streak_count: 5 }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const telegramId = searchParams.get('telegramId');
    const action = searchParams.get('action');

    if (!telegramId) {
      return NextResponse.json({ error: 'Telegram ID required' }, { status: 400 });
    }

    let result = {};

    switch (action) {
      case 'referral_info':
        result = {
          referralCode: 'NEXUS123456',
          stats: {
            total_referrals: 5,
            monthly_referrals: 2,
            total_bonus_gold: 250
          },
          referredUsers: [
            { username: 'NewUser1', full_name: 'New User 1', joined_date: new Date().toISOString(), subscription_type: 1 },
            { username: 'NewUser2', full_name: 'New User 2', joined_date: new Date().toISOString(), subscription_type: 0 }
          ],
          success: true
        };
        break;

      case 'leaderboard':
        result = {
          leaderboard: mockLeaderboard,
          userRank: 150,
          success: true
        };
        break;

      case 'friends':
        result = {
          friends: mockLeaderboard.slice(0, 3), // Mock friends
          success: true
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { telegramId, action, data } = body;

    if (!telegramId || !action) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    let result = {};

    switch (action) {
      case 'claim_referral_bonus':
        result = {
          success: true,
          bonusGold: 100,
          bonusXP: 50,
          message: 'Welcome bonus claimed successfully!'
        };
        break;

      case 'share_progress':
        const { platform } = data;
        result = {
          success: true,
          bonus: 25,
          message: `Shared on ${platform}! +25 gold`
        };
        break;

      case 'invite_friend':
        const { friendUsername } = data;
        const inviteCode = `INVITE${Date.now().toString(36)}`;
        result = {
          success: true,
          inviteCode,
          inviteLink: `https://t.me/nexus_quantum_bot?start=${inviteCode}`,
          message: 'Invitation sent successfully!'
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
