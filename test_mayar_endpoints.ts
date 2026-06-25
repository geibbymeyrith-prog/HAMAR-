import dotenv from 'dotenv';
dotenv.config();

const candidates = [
  'https://api.mayar.id/v2/payment/request',
  'https://api.mayar.id/v2/payment/link',
  'https://api.mayar.id/v2/payment/create-link',
  'https://api.mayar.id/v2/payment/invoice',
  'https://api.mayar.id/v2/payment/create',
  'https://api.mayar.id/v2/payment',
  'https://api.mayar.id/v2/payment-link',
  'https://api.mayar.id/v2/payment-request'
];

async function testEndpoints() {
  const apiKey = process.env.MAYAR_API_KEY;
  if (!apiKey) {
    console.error('No API key found');
    return;
  }

  for (const url of candidates) {
    console.log(`\nTesting: ${url}...`);
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
      console.log(`Status: ${res.status} ${res.statusText}`);
      const body = await res.text();
      console.log(`Response body: ${body.substring(0, 300)}`);
    } catch (err: any) {
      console.log(`Error testing ${url}: ${err.message || err}`);
    }
  }
}

testEndpoints();
