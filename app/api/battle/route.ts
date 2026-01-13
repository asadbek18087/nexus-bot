import { NextRequest, NextResponse } from 'next/server';

// Mock Database for Vercel Demo
const mockBattleRooms = new Map();
const mockUserStats = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { telegramId, action, battleData } = body;

    if (!telegramId || !action) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    // Mock User Data
    const user = { id: 1, username: 'Player', photo_url: '' };
    const stats = mockUserStats.get(telegramId) || { 
      level: 5, 
      xp: 1000, 
      gold: 500, 
      battle_wins: 10, 
      battle_losses: 2 
    };

    let result = {};

    switch (action) {
      case 'find_opponent': {
        // Mock Opponent
        const opponent = {
          id: 2,
          username: 'QuantumRival',
          level: 6,
          avatar: null
        };

        // Create battle room
        const roomId = 'battle_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        mockBattleRooms.set(roomId, {
          id: roomId,
          player1_id: user.id,
          player2_id: opponent.id,
          status: 'waiting'
        });

        result = {
          success: true,
          roomId,
          opponent
        };
        break;
      }

      case 'join_battle': {
        const { roomId } = battleData;
        if (!roomId) {
          return NextResponse.json({ error: 'Room ID required' }, { status: 400 });
        }

        const room = mockBattleRooms.get(roomId);
        // For demo, we might not find it if it was created in a different process/instance, 
        // but for a simple mock response we can pretend it exists or just ignore the check for now
        // if (!room) ... 

        result = {
          success: true,
          roomId,
          status: 'active',
          battleId: roomId
        };
        break;
      }

      case 'battle_result': {
        const { battleId, won, damage, accuracy } = battleData;
        
        if (!battleId) {
          return NextResponse.json({ error: 'Battle ID required' }, { status: 400 });
        }

        // Calculate rewards
        const xpReward = won ? 50 : 10;
        const goldReward = won ? 100 : 20;
        
        // Update mock stats
        const newWins = won ? stats.battle_wins + 1 : stats.battle_wins;
        const newLosses = won ? stats.battle_losses : stats.battle_losses + 1;
        const newXP = stats.xp + xpReward;
        const newGold = stats.gold + goldReward;

        mockUserStats.set(telegramId, {
          ...stats,
          battle_wins: newWins,
          battle_losses: newLosses,
          xp: newXP,
          gold: newGold
        });

        result = {
          success: true,
          won,
          xpReward,
          goldReward,
          newWins,
          newLosses,
          newXP,
          newGold
        };
        break;
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in battle API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    stats: {
      wins: 15,
      losses: 3,
      winRate: 83.3
    },
    recentBattles: [],
    success: true
  });
}
