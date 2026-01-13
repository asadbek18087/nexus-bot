import { NextRequest, NextResponse } from 'next/server';

// Mock quiz questions for Vercel deployment
const mockQuizQuestions = {
  general: [
    {
      id: 1,
      question: "Nima eng katta dengiz?",
      options: ["Tinch okean", "Atlantika okeani", "Hind okeani", "Arktika okeani"],
      correct_answer: 0,
      category: "general",
      difficulty: "easy"
    },
    {
      id: 2,
      question: "Yer qaysi sayyora?",
      options: ["Birinchi", "Ikkinchi", "Uchinchi", "To'rtinchi"],
      correct_answer: 2,
      category: "general",
      difficulty: "easy"
    }
  ],
  science: [
    {
      id: 3,
      question: "H2O nima?",
      options: ["Kislorod", "Vodorod", "Suv", "Azot"],
      correct_answer: 2,
      category: "science",
      difficulty: "medium"
    }
  ],
  technology: [
    {
      id: 4,
      question: "JavaScript qachon yaratilgan?",
      options: ["1995", "2000", "2005", "2010"],
      correct_answer: 0,
      category: "technology",
      difficulty: "medium"
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'general';
    const difficulty = searchParams.get('difficulty') || 'medium';

    // Get questions from mock data
    const questions = mockQuizQuestions[category as keyof typeof mockQuizQuestions] || mockQuizQuestions.general;

    // Format questions for frontend
    const formattedQuestions = questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correct_answer,
      category: q.category,
      difficulty: q.difficulty
    }));

    return NextResponse.json({
      success: true,
      questions: formattedQuestions,
      total: formattedQuestions.length
    });

  } catch (error) {
    console.error('❌ Quiz API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch quiz questions',
        questions: [],
        total: 0
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, quizId } = body;

    // Calculate score (mock implementation)
    let score = 0;
    const totalQuestions = answers?.length || 0;

    if (answers && Array.isArray(answers)) {
      score = answers.filter((answer: any) => answer.isCorrect).length;
    }

    // Calculate rewards
    const xpGained = score * 10;
    const goldGained = score * 5;

    return NextResponse.json({
      success: true,
      results: {
        score,
        totalQuestions,
        correctAnswers: score,
        xpGained,
        goldGained,
        percentage: totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
      }
    });

  } catch (error) {
    console.error('❌ Quiz submit error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit quiz',
        results: null
      },
      { status: 500 }
    );
  }
}
