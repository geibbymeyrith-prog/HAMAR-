import dotenv from 'dotenv';
dotenv.config();

async function testGet() {
  const apiKey = process.env.MAYAR_API_KEY;
  if (!apiKey) return;
  const url = 'https://api.mayar.id/v2/payment/request';
  console.log('Testing GET on:', url);
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    console.log('Status:', res.status, res.statusText);
    const text = await res.text();
    console.log('Response:', text);
  } catch (err: any) {
    console.log('Error:', err.message);
  }
}

testGet();
