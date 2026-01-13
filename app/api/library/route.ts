import { NextRequest, NextResponse } from 'next/server';

// Mock Data
const mockContent = [
  {
    id: 1,
    title: 'Quantum Physics for Beginners',
    type: 'book',
    category: 'science',
    description: 'Learn the basics of quantum mechanics.',
    thumbnail: '/images/book1.jpg',
    rating: 4.8,
    downloads: 120,
    isPremium: false
  },
  {
    id: 2,
    title: 'The Future of AI',
    type: 'course',
    category: 'tech',
    description: 'Deep dive into artificial intelligence.',
    thumbnail: '/images/course1.jpg',
    rating: 4.9,
    downloads: 85,
    isPremium: true
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const type = searchParams.get('type') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const telegramId = searchParams.get('telegramId');

    if (!telegramId) {
      return NextResponse.json({ error: 'Telegram ID required' }, { status: 400 });
    }

    // Filter mock content
    let filtered = mockContent;
    if (category !== 'all') filtered = filtered.filter(c => c.category === category);
    if (type !== 'all') filtered = filtered.filter(c => c.type === type);

    return NextResponse.json({
      content: filtered,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit)
      },
      isPremium: false, // Mock user is standard
      success: true
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { telegramId, action, contentId } = body;

    if (!telegramId || !action || !contentId) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    let result = {};

    switch (action) {
      case 'download':
        result = {
          success: true,
          downloadUrl: 'https://example.com/file.pdf',
          xpReward: 10,
          newXP: 100 // Mock value
        };
        break;

      case 'favorite':
        result = { success: true, favorited: true };
        break;

      case 'rate':
        result = { success: true, averageRating: 4.5 };
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
