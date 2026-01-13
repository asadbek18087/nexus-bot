import { NextRequest, NextResponse } from 'next/server';

// Mock Data
const mockUserStats = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { telegramId, action } = body;

    if (!telegramId || !action) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    // Get current mock stats
    const stats = mockUserStats.get(telegramId) || {
      energy: 100,
      crystals: 0,
      gold: 100,
      xp: 0,
      level: 1,
      max_energy: 100
    };

    let result = {};

    switch (action) {
      case 'mine':
        if (stats.energy < 10) {
          return NextResponse.json({ error: 'Insufficient energy' }, { status: 400 });
        }

        const minedGold = 25;
        const minedXP = 5;
        const newStats = {
          ...stats,
          energy: stats.energy - 10,
          crystals: stats.crystals + 1,
          gold: stats.gold + minedGold,
          xp: stats.xp + minedXP
        };
        mockUserStats.set(telegramId, newStats);

        result = {
          success: true,
          minedGold,
          minedXP,
          newEnergy: newStats.energy,
          newCrystals: newStats.crystals,
          newGold: newStats.gold,
          newXP: newStats.xp,
          levelUp: false
        };
        break;

      case 'energy_boost':
        const boostCost = 50;
        if (stats.gold < boostCost) {
          return NextResponse.json({ error: 'Insufficient gold' }, { status: 400 });
        }

        const boostedEnergy = Math.min(stats.energy + 50, stats.max_energy);
        mockUserStats.set(telegramId, {
          ...stats,
          energy: boostedEnergy,
          gold: stats.gold - boostCost
        });

        result = {
          success: true,
          newEnergy: boostedEnergy,
          newGold: stats.gold - boostCost
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in mining API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
