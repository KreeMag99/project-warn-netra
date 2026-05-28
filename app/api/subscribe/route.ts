import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';
import { rateLimit, getClientIp, isBot } from '@/lib/rate-limit';

const limiter = rateLimit({ name: 'subscribe', maxRequests: 3, windowSeconds: 60 });

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = getClientIp(req);
    const { allowed, remaining } = limiter.check(ip);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        {
          status: 429,
          headers: { 'Retry-After': '60', 'X-RateLimit-Remaining': '0' },
        }
      );
    }

    const body = await req.json();

    // Honeypot — silently accept but don't save
    if (isBot(body)) {
      return NextResponse.json({ success: true, message: 'Check your email to verify.' });
    }

    const { email, alertType, alertValue } = body;

    if (!email || !alertType || !alertValue) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email format basic structure
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address provided.' }, { status: 400 });
    }

    let subscription;
    try {
      subscription = await prisma.subscription.create({
        data: {
          email,
          alertType,
          alertValue
        }
      });
    } catch (dbError: any) {
      // P2002 is the generalized Prisma generic unique constraint violation error code
      if (dbError.code === 'P2002') {
        return NextResponse.json(
          { error: 'You are already subscribed to this specific alert.' },
          { status: 409 }
        );
      }
      throw dbError;
    }

    // Execute server-side transactional email using Resend
    const emailResult = await sendVerificationEmail(email, subscription.verificationToken);

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Subscription saved, but failed to send verification email. Try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Check your email to verify sequence completed.' },
      { headers: { 'X-RateLimit-Remaining': remaining.toString() } }
    );
  } catch (error) {
    console.error('Subscription API Error:', error);
    return NextResponse.json({ error: 'Internal server error occurred.' }, { status: 500 });
  }
}
