import { NextRequest, NextResponse } from 'next/server';

// Mock Data
const mockLeaderboard = [
  { rank: 1, username: 'CryptoKing', level: 42, xp: 150000, wins: 150, losses: 20 },
  { rank: 2, username: 'QuantumQueen', level: 38, xp: 125000, wins: 120, losses: 15 },
  { rank: 3, username: 'NexusMaster', level: 35, xp: 98000, wins: 100, losses: 10 },
  { rank: 4, username: 'StarWalker', level: 30, xp: 85000, wins: 80, losses: 8 },
  { rank: 5, username: 'CyberNinja', level: 28, xp: 72000, wins: 60, losses: 5 }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const telegramId = searchParams.get('telegramId');

    return NextResponse.json({
      leaderboard: mockLeaderboard,
      success: true
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
