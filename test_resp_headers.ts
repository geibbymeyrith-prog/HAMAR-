import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const apiKey = process.env.MAYAR_API_KEY;
  if (!apiKey) {
    console.log('No API key');
    return;
  }

  const url = 'https://api.mayar.id/v2/payment/request';
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
    console.log('Headers:');
    res.headers.forEach((value, name) => {
      console.log(`  ${name}: ${value}`);
    });
    const text = await res.text();
    console.log(`Body: ${text}`);
  } catch (e: any) {
    console.log('Error:', e.message);
  }
}

run();
