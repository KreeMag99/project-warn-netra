import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit, getClientIp, isBot } from '@/lib/rate-limit';

const limiter = rateLimit({ name: 'report', maxRequests: 5, windowSeconds: 60 });

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
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

    const body = await request.json();

    // Honeypot — silently accept but don't save
    if (isBot(body)) {
      return NextResponse.json({ success: true });
    }

    if (!body.companyName) {
      return NextResponse.json(
        { error: 'Company Name is required' },
        { status: 400 }
      );
    }

    const report = await prisma.report.create({
      data: {
        companyName: body.companyName,
        affected: body.affected ? parseInt(body.affected, 10) : null,
        location: body.location || null,
        reason: body.reason || null,
        sourceUrl: body.sourceUrl || null,
        reporterRole: body.reporterRole || null,
        details: body.details || null,
        status: 'pending',
      },
    });

    return NextResponse.json(
      { success: true, report },
      { headers: { 'X-RateLimit-Remaining': remaining.toString() } }
    );
  } catch (error) {
    console.error('Failed to submit report:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}
