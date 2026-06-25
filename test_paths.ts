import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const apiKey = process.env.MAYAR_API_KEY;
  if (!apiKey) {
    console.log('No API key');
    return;
  }

  const paths = [
    'https://api.mayar.id/v2/customer',
    'https://api.mayar.id/v2/transaction',
    'https://api.mayar.id/v2/invoice',
    'https://api.mayar.id/v1/customer',
    'https://api.mayar.id/v1/transaction',
    'https://api.mayar.id/v1/invoice',
    'https://api.mayar.id/customer',
    'https://api.mayar.id/transaction',
    'https://api.mayar.id/invoice'
  ];

  for (const url of paths) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      console.log(`GET ${url} -> status: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.log(`Response: ${text.substring(0, 150)}`);
    } catch (e: any) {
      console.log(`Error GET ${url}:`, e.message);
    }
  }
}

run();
