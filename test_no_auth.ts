async function testNoAuth() {
  const url = 'https://api.mayar.id/v2/payment/request';
  console.log('Testing POST with NO Auth header on:', url);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    console.log('Status:', res.status, res.statusText);
    const text = await res.text();
    console.log('Response:', text);
  } catch (err: any) {
    console.log('Error:', err.message);
  }
}

testNoAuth();
