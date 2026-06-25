import dotenv from 'dotenv';
dotenv.config();

const domains = [
  'api.sandbox.mayar.id',
  'api-sandbox.mayar.id',
  'sandbox.api.mayar.id',
  'sandbox.mayar.id',
  'api.mayar.id'
];

async function run() {
  const apiKey = process.env.MAYAR_API_KEY;
  if (!apiKey) {
    console.log('No API key');
    return;
  }

  for (const domain of domains) {
    const url = `https://${domain}/v2/payment/request`;
    console.log(`\nTesting domain: ${url}...`);
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
          description: 'Test payment'
        })
      });
      console.log(`Status: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.log(`Body: ${text.substring(0, 150)}`);
    } catch (e: any) {
      console.log(`Error testing ${domain}:`, e.message);
    }
  }
}

run();
