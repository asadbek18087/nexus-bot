import { NextRequest, NextResponse } from 'next/server';

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, difficulty = 'medium', count = 5, language = 'uz' } = body;

    // Mock generation function
    const generateMockQuestions = (topic: string, count: number, language: string, difficulty: string) => {
      const questions = [];
      const topics = {
        'matematika': ['Algebra', 'Geometriya', 'Hisob', 'Tenglamalar'],
        'fizika': ['Mexanika', 'Elektr', 'Optika', 'Termodinamika'],
        'tarix': ['O\'zbekiston tarixi', 'Jahon tarixi', 'Urushlar', 'Buyuk shaxslar'],
        'kimyo': ['Elementlar', 'Reaksiyalar', 'Moddalar', 'Atom tuzilishi'],
        'default': ['Umumiy bilimlar', 'Mantiq', 'Fan', 'Texnologiya']
      };

      const baseTopic = Object.keys(topics).find(t => topic.toLowerCase().includes(t)) || 'default';
      
      for (let i = 0; i < count; i++) {
        questions.push({
          id: `mock_${Date.now()}_${i}`,
          question: `${language === 'uz' ? 'Bu savol' : 'This is question'} #${i + 1} (${topic})`,
          options: [
            `${language === 'uz' ? 'Variant' : 'Option'} A`,
            `${language === 'uz' ? 'Variant' : 'Option'} B`,
            `${language === 'uz' ? 'Variant' : 'Option'} C`,
            `${language === 'uz' ? 'Variant' : 'Option'} D`
          ],
          correctAnswer: 0,
          explanation: language === 'uz' ? 'Bu test rejimidagi savol.' : 'This is a test mode question.',
          category: topic,
          difficulty,
          points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30,
          isAIGenerated: true
        });
      }
      return questions;
    };

    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API key missing, using mock data');
      const mockQuestions = generateMockQuestions(topic, count, language, difficulty);
      return NextResponse.json({
        questions: mockQuestions,
        success: true,
        topic,
        difficulty,
        language,
        isMock: true
      });
    }
    
    // Difficulty prompts
    const difficultyPrompts = {
      easy: 'oson, boshlang\'ich darajadagi',
      medium: 'o\'rta, o\'rtacha qiyinlikdagi', 
      hard: 'qiyin, chuqur bilim talab qiladigan'
    };

    const diffText = difficultyPrompts[difficulty] || difficultyPrompts.medium;

    const prompt = `Generate ${count} quiz questions in ${language === 'uz' ? 'Uzbek' : 'English'} language about "${topic}".
    
    Difficulty level: ${diffText}
    
    Format: JSON array with objects containing:
    - "question": question text in ${language === 'uz' ? 'Uzbek' : 'English'}
    - "options": array of 4 options in ${language === 'uz' ? 'Uzbek' : 'English'}
    - "correct": index of correct answer (0-3)
    - "explanation": detailed explanation (2-3 sentences) explaining WHY the correct answer is right and WHY other options are wrong
    
    Make questions engaging and educational. The explanation should help users understand the concept better.
    For wrong answers, briefly explain why they are incorrect.
    Return ONLY valid JSON array, no other text.`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a quiz generator. Return only valid JSON array.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      // Fallback to mock data on API error
      console.warn('Falling back to mock data due to API error');
      const mockQuestions = generateMockQuestions(topic, count, language, difficulty);
      return NextResponse.json({
        questions: mockQuestions,
        success: true,
        topic,
        difficulty,
        language,
        isMock: true,
        error: 'API error, used fallback'
      });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON from response
    let questions = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch.group());
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }

    // Format questions for frontend
    const formattedQuestions = questions.map((q: any, index: number) => ({
      id: `ai_${Date.now()}_${index}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correct,
      explanation: q.explanation || '',
      category: topic,
      difficulty,
      points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30,
      isAIGenerated: true
    }));

    return NextResponse.json({
      questions: formattedQuestions.slice(0, count),
      success: true,
      topic,
      difficulty,
      language
    });

  } catch (error) {
    console.error('Error in AI quiz generation:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      questions: []
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const available = !!OPENAI_API_KEY;

    return NextResponse.json({
      available,
      model: 'gpt-3.5-turbo',
      maxQuestions: 10,
      supportedLanguages: ['uz', 'en'],
      supportedDifficulties: ['easy', 'medium', 'hard']
    });

  } catch (error) {
    console.error('Error checking AI quiz availability:', error);
    return NextResponse.json({ 
      available: false,
      error: 'Service unavailable'
    }, { status: 500 });
  }
}
