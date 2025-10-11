import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
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
