# n8n WhatsApp Integration Setup

This document explains how to set up n8n to receive contact form submissions and send them to WhatsApp.

## Prerequisites

1. n8n instance (cloud or self-hosted)
2. WhatsApp Business API account or alternative WhatsApp integration
3. Basic knowledge of n8n workflows

## Setup Steps

### 1. Create n8n Workflow

1. Log in to your n8n instance
2. Create a new workflow
3. Add a **Webhook** node as the trigger

### 2. Configure Webhook Node

- **Webhook URLs**: Choose "Production URL"
- **HTTP Method**: POST
- **Path**: `/contact` (or your preferred path)
- **Response Mode**: "When Last Node Finishes"
- **Response Code**: 200

### 3. Add WhatsApp Node

Add one of these nodes depending on your setup:

#### Option A: Using Twilio (Recommended)
1. Add **Twilio** node
2. Select "Send Message" operation
3. Configure:
   - **From**: Your Twilio WhatsApp number
   - **To**: `whatsapp:+8801777871569`
   - **Message**: Use expressions to format the message

Example message template:
```
🔔 New Contact Form Submission

📧 From: {{$json["name"]}} ({{$json["email"]}})
📞 Phone: {{$json["phone"]}}

💬 Message:
{{$json["message"]}}

🕐 Received: {{$json["timestamp"]}}
```

#### Option B: Using WhatsApp Business API
1. Add **HTTP Request** node
2. Configure your WhatsApp Business API endpoint
3. Format the request body according to your API requirements

#### Option C: Using CallMeBot (Free, Simple)
1. Add **HTTP Request** node
2. Method: GET
3. URL: `https://api.callmebot.com/whatsapp.php`
4. Query Parameters:
   - `phone`: `8801777871569`
   - `text`: Your formatted message
   - `apikey`: Your CallMeBot API key

### 4. Format the Data

Add a **Set** node between Webhook and WhatsApp nodes to format the message:

```javascript
return {
  message: `🔔 New Contact Form Submission

📧 From: ${items[0].json.name} (${items[0].json.email})
📞 Phone: ${items[0].json.phone}

💬 Message:
${items[0].json.message}

🕐 Received: ${items[0].json.timestamp}`
};
```

### 5. Add Error Handling (Optional)

Add an **Error Trigger** node to handle failures and send error notifications.

### 6. Test the Workflow

1. Activate the workflow
2. Copy the webhook URL
3. Add it to your `.env.local` file:
   ```
   NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook-test/contact
   ```
4. Test by submitting the contact form

## Alternative Solutions

### Without n8n

If you don't want to use n8n, you can:

1. **Use API Routes**:
   - Create `/app/api/contact/route.ts`
   - Send directly to WhatsApp Business API or Twilio

2. **Use Formspree/FormSubmit**:
   - Simple form-to-email services
   - Less control but easier to set up

3. **Use Zapier/Make**:
   - Similar to n8n but with more pre-built integrations

## Security Tips

1. **Validate webhook requests**: Add authentication to your n8n webhook
2. **Rate limiting**: Implement rate limiting to prevent spam
3. **Sanitize input**: Always sanitize user input before sending
4. **Use HTTPS**: Ensure your n8n instance uses HTTPS
5. **Environment variables**: Never commit your webhook URL to git

## Troubleshooting

### Form submits but no WhatsApp message

1. Check n8n workflow execution logs
2. Verify WhatsApp node credentials
3. Check if the phone number is correct
4. Test webhook URL directly with Postman

### CORS errors

1. Add CORS headers in n8n webhook response
2. Or handle in Next.js API route

### Webhook not receiving data

1. Check network tab in browser
2. Verify webhook URL is correct
3. Check n8n workflow is activated

## Example n8n Workflow JSON

```json
{
  "name": "Contact Form to WhatsApp",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "contact",
        "responseMode": "lastNode",
        "responseCode": 200
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook"
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "message",
              "value": "=🔔 New Contact Form\\n\\n📧 From: {{$json[\"name\"]}} ({{$json[\"email\"]}})\\n📞 Phone: {{$json[\"phone\"]}}\\n\\n💬 Message:\\n{{$json[\"message\"]}}\\n\\n🕐 {{$json[\"timestamp\"]}}"
            }
          ]
        }
      },
      "name": "Format Message",
      "type": "n8n-nodes-base.set"
    },
    {
      "parameters": {
        "fromNumber": "whatsapp:+14155238886",
        "toNumber": "whatsapp:+8801777871569",
        "message": "={{$json[\"message\"]}}"
      },
      "name": "Twilio",
      "type": "n8n-nodes-base.twilio",
      "credentials": {
        "twilioApi": "Twilio Account"
      }
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{ "node": "Format Message", "type": "main", "index": 0 }]]
    },
    "Format Message": {
      "main": [[{ "node": "Twilio", "type": "main", "index": 0 }]]
    }
  }
}
```

## Support

For n8n specific issues, visit: https://community.n8n.io/
For Twilio issues, visit: https://www.twilio.com/docs/whatsapp