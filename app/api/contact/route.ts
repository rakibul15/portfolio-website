import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const timestamp = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Dhaka',
    })

    const text = [
      '📬 New Portfolio Message',
      '',
      `👤 Name: ${name}`,
      `📧 Email: ${email}`,
      phone ? `📞 Phone: ${phone}` : null,
      '',
      `💬 Message:`,
      message,
      '',
      `🕐 ${timestamp} (BD)`,
    ]
      .filter(Boolean)
      .join('\n')

    const results: string[] = []

    // --- Telegram ---
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (botToken && chatId) {
      const tgRes = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: 'HTML',
          }),
        }
      )

      if (tgRes.ok) {
        results.push('telegram')
      } else {
        console.error('Telegram error:', await tgRes.text())
      }
    }

    // --- WhatsApp via n8n webhook (optional) ---
    const n8nUrl = process.env.N8N_WEBHOOK_URL

    if (n8nUrl) {
      const n8nRes = await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || 'Not provided',
          message,
          timestamp: new Date().toISOString(),
        }),
      })

      if (n8nRes.ok) {
        results.push('n8n')
      } else {
        console.error('n8n error:', await n8nRes.text())
      }
    }

    if (results.length === 0) {
      console.error(
        'No delivery method configured. Set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID or N8N_WEBHOOK_URL in .env.local'
      )
      return NextResponse.json(
        { error: 'Message delivery not configured' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, delivered: results })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
