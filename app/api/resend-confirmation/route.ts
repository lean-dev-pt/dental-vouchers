import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, getClientIp } from '@/lib/rate-limiter';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Rate limit: 2 requests per email per hour
    const emailRateLimit = rateLimit(`resend-email:${email}`, {
      interval: 60 * 60 * 1000, // 1 hour
      maxRequests: 2,
    });

    if (!emailRateLimit.success) {
      const resetDate = new Date(emailRateLimit.reset);
      return NextResponse.json(
        {
          error: `Demasiadas tentativas. Por favor tente novamente após ${resetDate.toLocaleTimeString('pt-PT')}`,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': emailRateLimit.limit.toString(),
            'X-RateLimit-Remaining': emailRateLimit.remaining.toString(),
            'X-RateLimit-Reset': emailRateLimit.reset.toString(),
          },
        }
      );
    }

    // Rate limit by IP: 5 requests per 15 minutes
    const ip = getClientIp(req);
    const ipRateLimit = rateLimit(`resend-ip:${ip}`, {
      interval: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5,
    });

    if (!ipRateLimit.success) {
      return NextResponse.json(
        { error: 'Demasiadas tentativas deste dispositivo. Por favor tente mais tarde.' },
        { status: 429 }
      );
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
      console.error('Resend confirmation error:', error);
      return NextResponse.json(
        { error: error.message || 'Erro ao reenviar email de confirmação' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email de confirmação reenviado com sucesso',
    });
  } catch (error) {
    console.error('Resend confirmation error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
