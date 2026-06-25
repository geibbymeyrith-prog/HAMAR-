import dotenv from 'dotenv';
dotenv.config();

const extraEndpoints = [
  'https://api.mayar.id/v2/payment/link/create',
  'https://api.mayar.id/v2/payment/request/create',
  'https://api.mayar.id/v2/payment-links',
  'https://api.mayar.id/v2/payment-requests',
  'https://api.mayar.id/v2/invoices',
  'https://api.mayar.id/v2/invoice',
  'https://api.mayar.id/v2/pay/link',
  'https://api.mayar.id/v2/pay/request',
  'https://api.mayar.id/v2/checkout/link',
  'https://api.mayar.id/v2/checkout',
  'https://api.mayar.id/v2/link'
];

async function run() {
  const apiKey = process.env.MAYAR_API_KEY;
  if (!apiKey) {
    console.log('No API key');
    return;
  }

  for (const url of extraEndpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Test Customer',
          email: 'customer@test.com',
          amount: 15000,
          description: 'Access Premium Package'
        })
      });
      console.log(`POST ${url} -> status: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.log(`Response: ${text.substring(0, 150)}`);
    } catch (e: any) {
      console.log(`Error on ${url}:`, e.message);
    }
  }
}

run();
