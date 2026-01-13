import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Starting remote database seeding...');

    // Clear existing data (be careful!)
    // Order matters due to foreign keys
    await prisma.lesson.deleteMany().catch(() => {});
    await prisma.module.deleteMany().catch(() => {});
    await prisma.userCourse.deleteMany().catch(() => {});
    await prisma.course.deleteMany().catch(() => {});
    await prisma.miningFarm.deleteMany().catch(() => {});
    await prisma.movie.deleteMany().catch(() => {});
    await prisma.book.deleteMany().catch(() => {});
    // await prisma.user.deleteMany().catch(() => {}); // Don't delete users usually

    // Create test user if not exists
    const telegramId = BigInt(123456789);
    let testUser = await prisma.user.findUnique({ where: { telegramId } });
    
    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          telegramId,
          username: 'testuser',
          coins: 1000,
          energy: 100,
          isPremium: false,
        },
      });
    }

    // Create Mining Farm
    await prisma.miningFarm.upsert({
      where: { userId: testUser.id },
      update: {},
      create: {
        userId: testUser.id,
        level: 1,
        xpPerHour: 10,
      }
    });

    // Create Movies
    await prisma.movie.createMany({
      data: [
        {
          code: '1',
          title: 'Quantum Solace',
          genre: 'Sci-Fi',
          rating: 4.8,
          description: 'A journey through the quantum realm.',
          caption: 'Quantum Solace - 720p',
          quality: '720p',
          isActive: true
        },
        {
          code: '2',
          title: 'Cyber Hunter',
          genre: 'Action',
          rating: 4.6,
          description: 'Hunting cyber criminals in 2077.',
          caption: 'Cyber Hunter - 1080p',
          quality: '1080p',
          isActive: true
        },
        {
          code: '3',
          title: 'Deep Mind',
          genre: 'Documentary',
          rating: 4.9,
          description: 'The story of AI evolution.',
          caption: 'Deep Mind - 720p',
          isActive: true
        }
      ]
    });

    // Create Books
    await prisma.book.createMany({
      data: [
        {
          code: '101',
          title: 'The Quantum Age',
          author: 'Dr. A. Nexus',
          genre: 'Quantum Physics',
          description: 'Understanding quantum mechanics.',
          rating: 4.9,
          isActive: true
        },
        {
          code: '102',
          title: 'Neural Networks 101',
          author: 'Sarah Bit',
          genre: 'AI & Tech',
          description: 'Basics of Neural Networks.',
          rating: 4.8,
          isActive: true
        }
      ]
    });

    // Create Courses
    const pythonCourse = await prisma.course.create({
      data: {
        title: 'Python for AI',
        description: 'Master Python for Artificial Intelligence.',
        author: 'Dr. Py',
        level: 'Beginner',
        duration: '10h 30m',
        priceCoins: 100,
        modules: {
          create: [
            {
              title: 'Intro',
              order: 1,
              lessons: {
                create: [{ title: 'Setup', order: 1 }]
              }
            }
          ]
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully',
      stats: {
        user: testUser.username,
        movies: 3,
        books: 2,
        course: pythonCourse.title
      }
    });

  } catch (error: any) {
    console.error('Seeding failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
