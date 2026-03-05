import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { emotion, rawText } = await req.json();

  if (!emotion || !rawText) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      summary: `You felt ${emotion.toLowerCase()} and needed a moment to process your emotions.`,
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 60,
        messages: [
          {
            role: 'user',
            content: `Summarize this emotional reflection in 1-2 short sentences. The person is feeling ${emotion}. Their reflection: "${rawText}". Write in second person ("You felt..."). Be empathetic and concise.`,
          },
        ],
      }),
    });

    const data = await response.json();
    const summary =
      data.content?.[0]?.text ||
      `You felt ${emotion.toLowerCase()} and needed a moment to process your emotions.`;

    return NextResponse.json({ summary });
  } catch {
    return NextResponse.json({
      summary: `You felt ${emotion.toLowerCase()} and needed a moment to process your emotions.`,
    });
  }
}
