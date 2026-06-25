import dotenv from 'dotenv';
dotenv.config();

function test() {
  const key = process.env.MAYAR_API_KEY || '';
  console.log('Length:', key.length);
  console.log('Prefix:', key.substring(0, 30));
  console.log('Suffix:', key.substring(key.length - 20));
}
test();
