import dotenv from 'dotenv';
dotenv.config();

const endpoints = [
  'https://api.mayar.id/v2/payment/request',
  'https://api.mayar.id/v1/payment/request',
  'https://api.mayar.id/v2/payment/link',
  'https://api.mayar.id/v1/payment/link',
  'https://api.mayar.id/v2/payment/create',
  'https://api.mayar.id/v1/payment/create',
  'https://api.mayar.id/v2/payment-link',
  'https://api.mayar.id/v1/payment-link',
  'https://api.mayar.id/v2/payment/create-payment',
  'https://api.mayar.id/v1/payment/create-payment'
];

async function run() {
  const apiKey = process.env.MAYAR_API_KEY;
  if (!apiKey) {
    console.log('No API key');
    return;
  }

  for (const url of endpoints) {
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
          mobile: '081234567890',
          amount: 15000,
          description: 'Access Premium Package',
          redirectUrl: 'https://example.com'
        })
      });
      console.log(`${url} -> status: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.log(`Response: ${text.substring(0, 200)}`);
    } catch (e: any) {
      console.log(`Error on ${url}:`, e.message);
    }
  }
}

run();
