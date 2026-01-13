import { NextRequest, NextResponse } from 'next/server';
import { claimMiningReward } from '@/actions/economy';

export async function POST(request: NextRequest) {
  try {
    const { telegramId } = await request.json();
    
    const result = await claimMiningReward(BigInt(telegramId));
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Mining claim error:', error);
    return NextResponse.json({ error: 'Failed to claim reward' }, { status: 500 });
  }
}
