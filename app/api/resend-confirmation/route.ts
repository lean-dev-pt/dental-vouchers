import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ResendEmailSchema, validateInput } from '@/lib/validations/api-schemas';
import { logger } from '@/lib/logger';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const validation = validateInput(ResendEmailSchema, body);

    if (!validation.success) {
      logger.warn('Resend email validation failed', { error: validation.error });
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Apply aggressive rate limiting (use email as identifier)
    const rateLimitResult = await rateLimit(req, 'email', email);
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    const supabase = await createClient();

    // Resend confirmation email
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${req.nextUrl.origin}/dashboard`,
      },
    });

    if (error) {
      logger.error('Failed to resend confirmation email', error, { email });
      return NextResponse.json(
        { error: 'Erro ao reenviar email de confirmação' },
        { status: 500 }
      );
    }

    logger.info('Confirmation email resent successfully', { email });

    return NextResponse.json({
      success: true,
      message: 'Email de confirmação reenviado com sucesso',
    });
  } catch (error) {
    logger.error('Resend confirmation error', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
