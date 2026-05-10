import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
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

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error('Failed to submit report:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}
