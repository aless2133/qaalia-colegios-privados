// src/app/api/paddle/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Paddle, Environment, EventName } from '@paddle/paddle-node-sdk';
import { createClient } from '@supabase/supabase-js';

const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment:
    process.env.PADDLE_ENV === 'production'
      ? Environment.production
      : Environment.sandbox,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Paso único hacia Supabase. Todos los eventos terminan acá.
async function sincronizar(params: {
  paddleSubscriptionId: string;
  ownerId?: string | null;
  planSlug?: string | null;
  estado?: string | null;
  paddleCustomerId?: string | null;
  paddleTransactionId?: string | null;
  fechaInicio?: string | null;
  fechaFinPeriodo?: string | null;
  precioPagado?: number | null;
}) {
  const { error } = await supabase.rpc('sincronizar_suscripcion_paddle', {
    p_paddle_subscription_id: params.paddleSubscriptionId,
    p_owner_id: params.ownerId ?? null,
    p_plan_slug: params.planSlug ?? null,
    p_estado: params.estado ?? null,
    p_paddle_customer_id: params.paddleCustomerId ?? null,
    p_paddle_transaction_id: params.paddleTransactionId ?? null,
    p_fecha_inicio: params.fechaInicio ?? null,
    p_fecha_fin_periodo: params.fechaFinPeriodo ?? null,
    p_precio_pagado: params.precioPagado ?? null,
  });

  if (error) console.error('[paddle-webhook] error al sincronizar:', error);
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get('paddle-signature') ?? '';
  const rawBody = await request.text(); // crudo — obligatorio, no uses request.json()

  let eventData;
  try {
    eventData = await paddle.webhooks.unmarshal(
      rawBody,
      process.env.PADDLE_WEBHOOK_SECRET!,
      signature
    );
  } catch (err) {
    console.error('[paddle-webhook] firma inválida:', err);
    return NextResponse.json({ error: 'firma inválida' }, { status: 400 });
  }

  if (!eventData) {
    return NextResponse.json({ error: 'evento vacío' }, { status: 400 });
  }

  switch (eventData.eventType) {
    case EventName.SubscriptionCreated:
    case EventName.SubscriptionUpdated:
    case EventName.SubscriptionCanceled: {
      const sub = eventData.data;
      // customData son los datos que TÚ pasas al abrir el checkout (Fase 1, nota final)
      const customData = (sub.customData ?? {}) as Record<string, string>;

      await sincronizar({
        paddleSubscriptionId: sub.id,
        ownerId: customData.owner_id ?? null,
        planSlug: customData.plan_slug ?? null,
        estado: sub.status, // trialing | active | past_due | paused | canceled — igual a tu enum
        paddleCustomerId: sub.customerId,
        fechaInicio: sub.startedAt ?? null,
        fechaFinPeriodo: sub.nextBilledAt ?? sub.currentBillingPeriod?.endsAt ?? null,
      });
      break;
    }

    case EventName.TransactionCompleted: {
      const txn = eventData.data;
      if (txn.subscriptionId) {
        const customData = (txn.customData ?? {}) as Record<string, string>;
        await sincronizar({
          paddleSubscriptionId: txn.subscriptionId,
          ownerId: customData.owner_id ?? null,
          planSlug: customData.plan_slug ?? null,
          paddleTransactionId: txn.id,
          // Paddle devuelve el total en la unidad mínima de la moneda (centavos)
          precioPagado: txn.details?.totals?.total
            ? Number(txn.details.totals.total) / 100
            : null,
        });
      }
      break;
    }

    default:
      break; // otros eventos no requieren acción por ahora
  }

  return NextResponse.json({ recibido: true }, { status: 200 });
}