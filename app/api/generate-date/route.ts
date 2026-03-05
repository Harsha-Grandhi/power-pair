import { NextResponse } from 'next/server';
import { generateMultipleDates, TimeSlot } from '@/services/dateEngine';

const VALID_SLOTS: TimeSlot[] = ['30min', '1hr', '3hrs'];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { partner1, partner2, timeSlot } = body;

    if (
      typeof partner1 !== 'string' ||
      typeof partner2 !== 'string' ||
      !VALID_SLOTS.includes(timeSlot)
    ) {
      return NextResponse.json(
        { error: 'Invalid input. Provide partner1 (4-letter code), partner2 (4-letter code), and timeSlot (30min|1hr|3hrs).' },
        { status: 400 }
      );
    }

    const ideas = generateMultipleDates(partner1, partner2, timeSlot);
    return NextResponse.json({ ideas });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
