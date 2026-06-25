import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const apiKey = process.env.MAYAR_API_KEY;
  if (!apiKey) {
    console.log('No API key');
    return;
  }

  const url = 'https://api.mayar.id/v2/payment/request';
  const headersVariations = [
    { 'Authorization': `Bearer ${apiKey}` },
    { 'Authorization': apiKey },
    { 'x-api-key': apiKey },
    { 'X-API-KEY': apiKey },
    { 'api-key': apiKey },
    { 'x-mayar-key': apiKey }
  ];

  for (let i = 0; i < headersVariations.length; i++) {
    const headers = {
      'Content-Type': 'application/json',
      ...headersVariations[i]
    };
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: 'Test Customer',
          email: 'customer@test.com',
          mobile: '081234567890',
          amount: 15000,
          description: 'Access Premium Package',
          redirectUrl: 'https://example.com'
        })
      });
      console.log(`Variation ${i + 1}: headers=${Object.keys(headersVariations[i])} -> status: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.log(`Response: ${text.substring(0, 200)}`);
    } catch (e: any) {
      console.log(`Error variation ${i + 1}:`, e.message);
    }
  }
}

run();
