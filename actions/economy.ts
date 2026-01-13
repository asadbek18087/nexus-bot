"use server";

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function getUserCoins(telegramId: string | bigint) {
  const id = typeof telegramId === 'string' ? BigInt(telegramId) : telegramId;
  const user = await prisma.user.findUnique({
    where: { telegramId: id }
  });
  return user?.coins || 0;
}

export async function spendCoins(telegramId: string | bigint, amount: number) {
  const id = typeof telegramId === 'string' ? BigInt(telegramId) : telegramId;
  const user = await prisma.user.findUnique({
    where: { telegramId: id }
  });

  if (!user || user.coins < amount) {
    return { success: false, message: 'Not enough coins' };
  }

  await prisma.user.update({
    where: { telegramId: id },
    data: { coins: { decrement: amount } }
  });

  revalidatePath('/hub');
  return { success: true };
}

export async function addCoins(telegramId: string | bigint, amount: number) {
  const id = typeof telegramId === 'string' ? BigInt(telegramId) : telegramId;
  await prisma.user.upsert({
    where: { telegramId: id },
    update: { coins: { increment: amount } },
    create: { 
      telegramId: id,
      coins: amount,
      energy: 100
    }
  });

  revalidatePath('/hub');
}

export async function purchaseItem(telegramId: string | bigint, itemType: string, price: number) {
  const id = typeof telegramId === 'string' ? BigInt(telegramId) : telegramId;
  return await prisma.$transaction(async (tx) => {
    // 1. Check user balance
    const user = await tx.user.findUnique({
      where: { telegramId: id }
    });

    if (!user || user.coins < price) {
      throw new Error('Insufficient coins');
    }

    // 2. Deduct coins
    await tx.user.update({
      where: { telegramId: id },
      data: { coins: { decrement: price } }
    });

    // 3. Add to inventory with PENDING status
    const inventoryItem = await tx.inventoryItem.create({
      data: {
        userId: user.id,
        productId: itemType, // This should be product ID, not type
        status: 'PENDING'
      }
    });

    // 4. Notify bot (in real implementation, this would be a webhook)
    // await notifyBot(inventoryItem.id);

    return { success: true, itemId: inventoryItem.id };
  });
}

export async function claimMiningReward(telegramId: string | bigint) {
  const id = typeof telegramId === 'string' ? BigInt(telegramId) : telegramId;
  
  // 1. Get User and Farm
  const user = await prisma.user.findUnique({
    where: { telegramId: id },
    include: { miningFarm: true }
  });

  if (!user) return { success: false, message: 'User not found' };

  // Initialize farm if missing
  let farm = user.miningFarm;
  if (!farm) {
    farm = await prisma.miningFarm.create({
      data: {
        userId: user.id,
        level: 1,
        xpPerHour: 10
      }
    });
  }

  const now = new Date();
  const lastCollected = new Date(farm.lastCollected);
  const diffMs = now.getTime() - lastCollected.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  // Calculate reward based on XP/Hour
  const accrued = Math.floor(diffHours * farm.xpPerHour);

  if (accrued < 1) {
    const minutesLeft = Math.ceil((1 - diffHours) * 60);
    return { 
      success: false, 
      message: `Wait a bit more`,
      minutesLeft: minutesLeft > 0 ? minutesLeft : 1
    };
  }

  // 2. Update DB
  await prisma.$transaction([
    prisma.miningFarm.update({
      where: { id: farm.id },
      data: {
        lastCollected: now,
        totalCollected: { increment: accrued }
      }
    }),
    prisma.user.update({
      where: { id: user.id },
      data: {
        coins: { increment: accrued } // Converting XP to Coins 1:1 for simplicity
      }
    })
  ]);

  revalidatePath('/hub');
  revalidatePath('/mining');
  return { success: true, coinsEarned: accrued };
}
