import dotenv from 'dotenv';
dotenv.config();

function decodeJwt() {
  const token = process.env.MAYAR_API_KEY;
  if (!token) return;
  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      console.log('Not a standard JWT');
      return;
    }
    const payload = Buffer.from(parts[1], 'base64').toString();
    console.log('Decoded payload:', JSON.parse(payload));
  } catch (err: any) {
    console.log('Error decoding:', err.message);
  }
}

decodeJwt();
