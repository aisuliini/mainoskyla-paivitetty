import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16'as const,
})

export async function POST(req: NextRequest) {
  const ilmoitusData = await req.json()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price: ilmoitusData.priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/onnistui?ilmoitusData=` + 
      encodeURIComponent(JSON.stringify(ilmoitusData)),
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/peruttu`,
  })

  return NextResponse.json({ url: session.url })
}
