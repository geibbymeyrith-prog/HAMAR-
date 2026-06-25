import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

dotenv.config();

async function run() {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!saJson) {
    console.log('No service account JSON found in env');
    return;
  }

  // 1. Initialize admin SDK to verify document changes
  const serviceAccount = JSON.parse(saJson);
  const app = initializeApp({
    credential: cert(serviceAccount),
    projectId: firebaseConfig.projectId,
  }, 'e2e-test-app');
  
  const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

  console.log('--- STEP 1: Creating a pending payment document via API ---');
  const createRes = await fetch('http://localhost:3000/api/create-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: 'test-user-e2e',
      name: 'E2E Tester',
      email: 'e2e@example.com',
      whatsapp: '08123456789',
      packageId: '150000', // Monthly Unlimited Package
      amount: 150000
    })
  });

  if (!createRes.ok) {
    console.error('Failed to create payment via API:', createRes.status, await createRes.text());
    return;
  }

  const createData = await createRes.json();
  console.log('Create Payment Response:', createData);
  const mayarPaymentId = createData.mayarPaymentId;

  // 2. Query Firestore to verify the pending document was written
  console.log('--- STEP 2: Checking pending payment document in Firestore ---');
  const querySnap = await db.collection('payments')
    .where('mayarPaymentId', '==', mayarPaymentId)
    .get();

  if (querySnap.empty) {
    console.error('Pending payment document not found in Firestore!');
    return;
  }

  const paymentDoc = querySnap.docs[0];
  console.log('Found pending payment document ID:', paymentDoc.id);
  console.log('Status in Firestore:', paymentDoc.data().status);

  // 3. Simulate Mayar Webhook call
  console.log('--- STEP 3: Simulating Mayar Webhook callback ---');
  // Since we might have MAYAR_WEBHOOK_TOKEN configured, let's see if we should generate a signature or if it skips
  const webhookToken = process.env.MAYAR_WEBHOOK_TOKEN;
  const webhookPayload = {
    payment_id: mayarPaymentId,
    status: 'success',
    amount: 150000,
    data: {
      id: mayarPaymentId,
      status: 'success',
      amount: 150000
    }
  };
  const bodyString = JSON.stringify(webhookPayload);
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (webhookToken && webhookToken !== 'MY_MAYAR_WEBHOOK_TOKEN' && webhookToken !== '') {
    // Generate actual HMAC signature!
    const crypto = await import('crypto');
    const computedSignature = crypto.createHmac('sha256', webhookToken).update(bodyString).digest('hex');
    headers['x-mayar-signature'] = computedSignature;
    console.log('Generated HMAC Signature:', computedSignature);
  }

  const webhookRes = await fetch('http://localhost:3000/api/webhook/mayar', {
    method: 'POST',
    headers,
    body: bodyString
  });

  console.log('Webhook Response Status:', webhookRes.status, webhookRes.statusText);
  const webhookData = await webhookRes.json();
  console.log('Webhook Response Body:', webhookData);

  // 4. Verify the document has been updated to "completed" in Firestore
  console.log('--- STEP 4: Verifying payment document state change in Firestore ---');
  const updatedDocSnap = await db.collection('payments').doc(paymentDoc.id).get();
  const updatedData = updatedDocSnap.data();
  console.log('Updated Payment Document status:', updatedData?.status);
  console.log('PaidAt:', updatedData?.paidAt);
  console.log('Webhook Audit Trail:', updatedData?.webhookAuditTrail);

  if (updatedData?.status === 'completed') {
    console.log('\n🎉 SUCCESS! The E2E Webhook integration works flawlessly!');
  } else {
    console.error('\n❌ FAILURE: Payment document was not updated to completed.');
  }
}

run();
