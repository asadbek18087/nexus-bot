"use server";

import { prisma } from '@/lib/prisma';
import { Book, Movie, Course, MiningFarm } from '@prisma/client';

// --- Library (Books) ---

export async function getBooks(category?: string, searchQuery?: string) {
  try {
    const where: any = { isActive: true };
    
    if (category && category !== 'All') {
      where.genre = category;
    }
    
    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { author: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } }
      ];
    }

    return await prisma.book.findMany({
      where,
      orderBy: { uploadDate: 'desc' }
    });
  } catch (error) {
    console.error('Failed to fetch books:', error);
    return [];
  }
}

export async function getBookById(id: string) {
  return await prisma.book.findUnique({ where: { id } });
}

// --- Cinema (Movies) ---

export async function getMovies(category?: string, searchQuery?: string) {
  try {
    const where: any = { isActive: true };
    
    if (category && category !== 'All') {
      where.genre = category;
    }
    
    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { caption: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } }
      ];
    }

    return await prisma.movie.findMany({
      where,
      orderBy: { uploadDate: 'desc' }
    });
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    return [];
  }
}

export async function getMovieById(id: string) {
  return await prisma.movie.findUnique({ where: { id } });
}

// --- Academy (Courses) ---

export async function getCourses(level?: string) {
  try {
    const where: any = {};
    if (level && level !== 'All') {
      where.level = level;
    }

    return await prisma.course.findMany({
      where,
      include: {
        _count: {
          select: { modules: true }
        }
      }
    });
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return [];
  }
}

export async function getUserCourses(telegramId: string | bigint) {
  try {
    const id = typeof telegramId === 'string' ? BigInt(telegramId) : telegramId;
    const user = await prisma.user.findUnique({ where: { telegramId: id } });
    
    if (!user) return [];

    return await prisma.userCourse.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: {
            _count: {
              select: { modules: true }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Failed to fetch user courses:', error);
    return [];
  }
}

// --- Mining ---

export async function getMiningFarm(telegramId: string | bigint) {
  try {
    const id = typeof telegramId === 'string' ? BigInt(telegramId) : telegramId;
    const user = await prisma.user.findUnique({ 
      where: { telegramId: id },
      include: { miningFarm: true }
    });

    if (!user) return null;

    if (!user.miningFarm) {
      // Create default farm if not exists
      return await prisma.miningFarm.create({
        data: {
          userId: user.id,
          level: 1,
          xpPerHour: 10
        }
      });
    }

    return user.miningFarm;
  } catch (error) {
    console.error('Failed to fetch mining farm:', error);
    return null;
  }
}

export async function upgradeMiningFarm(telegramId: string | bigint) {
  try {
    const id = typeof telegramId === 'string' ? BigInt(telegramId) : telegramId;
    const user = await prisma.user.findUnique({ 
      where: { telegramId: id },
      include: { miningFarm: true }
    });

    if (!user || !user.miningFarm) return { success: false, message: 'Farm not found' };

    const cost = user.miningFarm.level * 100; // Example formula

    if (user.coins < cost) {
      return { success: false, message: 'Insufficient coins' };
    }

    // Transaction to deduct coins and upgrade farm
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { coins: { decrement: cost } }
      }),
      prisma.miningFarm.update({
        where: { id: user.miningFarm.id },
        data: {
          level: { increment: 1 },
          xpPerHour: { increment: 10 } // +10 per level
        }
      })
    ]);

    return { success: true };
  } catch (error) {
    console.error('Failed to upgrade farm:', error);
    return { success: false, message: 'Server error' };
  }
}
