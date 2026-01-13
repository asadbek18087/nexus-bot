import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clear existing data (order matters due to foreign keys)
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.userCourse.deleteMany();
  await prisma.course.deleteMany();
  await prisma.miningFarm.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.activityHistory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleared existing data');

  // Create test user
  const testUser = await prisma.user.create({
    data: {
      telegramId: BigInt(123456789),
      username: 'testuser',
      coins: 1000,
      energy: 100,
      isPremium: false,
    },
  });
  console.log('Created test user:', testUser.username);

  // Create Mining Farm for test user
  await prisma.miningFarm.create({
    data: {
      userId: testUser.id,
      level: 1,
      xpPerHour: 10,
    }
  });

  // Create products (Cinema)
  await prisma.product.createMany({
    data: [
      {
        type: 'movie',
        title: 'Quantum Solace',
        category: 'Sci-Fi',
        priceCoins: 50,
        fileId: 'BQACAgIAAxkBAAICGmZn_ExampleMovieFileID',
        rating: 4.8,
        description: 'A journey through the quantum realm.',
        image: 'bg-indigo-900/50'
      },
      {
        type: 'movie',
        title: 'Cyber Hunter',
        category: 'Action',
        priceCoins: 45,
        fileId: 'BQACAgIAAxkBAAICHMZ_ExampleMovieFileID2',
        rating: 4.6,
        description: 'Hunting cyber criminals in 2077.',
        image: 'bg-pink-900/50'
      },
      {
        type: 'movie',
        title: 'Deep Mind',
        category: 'Documentary',
        priceCoins: 30,
        fileId: 'BQACAgIAAxkBAAICHMZ_ExampleMovieFileID3',
        rating: 4.9,
        description: 'The story of AI evolution.',
        image: 'bg-blue-900/50'
      },
      {
        type: 'movie',
        title: 'Neon Genesis',
        category: 'Anime',
        priceCoins: 40,
        fileId: 'BQACAgIAAxkBAAICHMZ_ExampleMovieFileID4',
        rating: 4.7,
        description: 'Mecha battles in Neo Tokyo.',
        image: 'bg-purple-900/50'
      }
    ],
  });

  // Create products (Library)
  const book = await prisma.product.create({
    data: {
      type: 'book',
      title: 'The Quantum Age',
      author: 'Dr. A. Nexus',
      category: 'Quantum Physics',
      priceCoins: 25,
      fileId: 'BQACAgIAAxkBAAICHMZ_ExampleBookFileID',
      rating: 4.9,
      description: 'Understanding quantum mechanics.',
      image: 'bg-blue-900/50'
    },
  });

  await prisma.product.createMany({
    data: [
      {
        type: 'book',
        title: 'Neural Networks 101',
        author: 'Sarah Bit',
        category: 'AI & Tech',
        priceCoins: 20,
        fileId: 'BQACAgIAAxkBAAICHMZ_ExampleBookFileID2',
        rating: 4.8,
        image: 'bg-purple-900/50'
      },
      {
        type: 'book',
        title: 'Beyond the Void',
        author: 'J. Star',
        category: 'Sci-Fi',
        priceCoins: 15,
        fileId: 'BQACAgIAAxkBAAICHMZ_ExampleBookFileID3',
        rating: 4.7,
        image: 'bg-indigo-900/50'
      },
      {
        type: 'book',
        title: 'Digital Ethics',
        author: 'M. Logic',
        category: 'Philosophy',
        priceCoins: 10,
        fileId: 'BQACAgIAAxkBAAICHMZ_ExampleBookFileID4',
        rating: 4.9,
        image: 'bg-emerald-900/50'
      }
    ]
  });

  // Create Courses
  const pythonCourse = await prisma.course.create({
    data: {
      title: 'Python for AI',
      description: 'Master Python for Artificial Intelligence applications.',
      author: 'Dr. Py',
      level: 'Beginner',
      duration: '10h 30m',
      priceCoins: 100,
      image: 'bg-yellow-900/50',
      modules: {
        create: [
          {
            title: 'Introduction to Python',
            order: 1,
            lessons: {
              create: [
                { title: 'Variables & Types', order: 1, content: 'Learn about variables.' },
                { title: 'Control Flow', order: 2, content: 'If statements and loops.' }
              ]
            }
          },
          {
            title: 'Data Structures',
            order: 2,
            lessons: {
              create: [
                { title: 'Lists & Dicts', order: 1, content: 'Storing data efficiently.' }
              ]
            }
          }
        ]
      }
    }
  });

  await prisma.course.create({
    data: {
      title: 'Quantum Computing',
      description: 'Introduction to Qubits and Superposition.',
      author: 'Q. Bit',
      level: 'Expert',
      duration: '15h',
      priceCoins: 200,
      image: 'bg-blue-900/50',
      modules: {
        create: [
          {
            title: 'Quantum Basics',
            order: 1,
            lessons: {
              create: [
                { title: 'Superposition', order: 1 },
                { title: 'Entanglement', order: 2 }
              ]
            }
          }
        ]
      }
    }
  });

  // Enroll user in Python course
  await prisma.userCourse.create({
    data: {
      userId: testUser.id,
      courseId: pythonCourse.id,
      progress: 15
    }
  });

  console.log('Database seeded successfully! 🎉');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
