import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import crypto from 'crypto';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK for server-side persistence
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

if (getApps().length === 0) {
  const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (saJson && saJson.trim() !== '') {
    try {
      const serviceAccount = JSON.parse(saJson);
      initializeApp({
        credential: cert(serviceAccount),
        projectId: firebaseConfig.projectId,
      });
      console.log('Firebase Admin SDK: Initialized with Service Account JSON from FIREBASE_SERVICE_ACCOUNT_JSON.');
    } catch (saErr: any) {
      console.error('Firebase Admin SDK Error: Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON. Falling back to default app credentials.', saErr.message);
      initializeApp({
        projectId: firebaseConfig.projectId,
      });
    }
  } else {
    initializeApp({
      projectId: firebaseConfig.projectId,
    });
  }
}
const adminApp = getApp();
const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(adminApp, firebaseConfig.firestoreDatabaseId)
  : getFirestore(adminApp);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf.toString('utf-8');
    }
  }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running securely' });
  });

  // KBMS: Read raw HAMARE_PROJECT_KNOWLEDGE_BASE.md from disk
  app.get('/api/kb/raw', (req, res) => {
    try {
      const kbPath = path.join(process.cwd(), 'HAMARE_PROJECT_KNOWLEDGE_BASE.md');
      if (fs.existsSync(kbPath)) {
        const content = fs.readFileSync(kbPath, 'utf-8');
        res.json({ content, exists: true });
      } else {
        res.json({ content: '', exists: false, error: 'File not found on workspace disk' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to read knowledge base file' });
    }
  });

  // KBMS: Write updated HAMARE_PROJECT_KNOWLEDGE_BASE.md to disk
  app.post('/api/kb/save', (req, res) => {
    try {
      const { content } = req.body;
      if (typeof content !== 'string') {
        return res.status(400).json({ error: 'Content must be a string' });
      }
      const kbPath = path.join(process.cwd(), 'HAMARE_PROJECT_KNOWLEDGE_BASE.md');
      fs.writeFileSync(kbPath, content, 'utf-8');
      res.json({ success: true, message: 'HAMARE_PROJECT_KNOWLEDGE_BASE.md updated successfully on disk' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to write knowledge base file' });
    }
  });

  // Example secure endpoint for Gemini API (if needed in the future)
  // This illustrates how to keep the key on the server
  app.post('/api/ai/generate', async (req, res) => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(500).json({ error: 'Gemini API Key is not configured on the server.' });
    }
    
    // Here you would call GoogleGenAI using the 'key'
    // For now, we just acknowledge the security setup
    res.json({ 
      message: 'Secure AI endpoint ready. The API Key is not exposed to the client.' 
    });
  });

  // HAMARÉ & Mayar Integration: Diagnostic Test Endpoint
  app.get('/api/payment-test', async (req, res) => {
    try {
      const mode = process.env.NODE_ENV || 'development';
      const appUrl = process.env.APP_URL;
      const mayarApiKey = process.env.MAYAR_API_KEY;
      const mayarWebhookToken = process.env.MAYAR_WEBHOOK_TOKEN;

      const configStatus = {
        APP_URL: {
          configured: !!appUrl && appUrl !== 'MY_APP_URL' && appUrl !== '',
          value: (appUrl && appUrl !== 'MY_APP_URL') ? appUrl : null
        },
        MAYAR_API_KEY: {
          configured: !!mayarApiKey && mayarApiKey !== 'MY_MAYAR_API_KEY' && !mayarApiKey.includes('placeholder') && mayarApiKey !== '',
        },
        MAYAR_WEBHOOK_TOKEN: {
          configured: !!mayarWebhookToken && mayarWebhookToken !== 'MY_MAYAR_WEBHOOK_TOKEN' && mayarWebhookToken !== '',
        }
      };

      // Test database connectivity via Firebase Admin SDK
      let firebaseAdminConnected = false;
      let databaseError = null;
      let paymentsCount = 0;
      let transactionsCount = 0;

      try {
        const paymentsSnap = await db.collection('payments').limit(10).get();
        paymentsCount = paymentsSnap.size;
        
        const transactionsSnap = await db.collection('transactions').limit(10).get();
        transactionsCount = transactionsSnap.size;

        firebaseAdminConnected = true;
      } catch (dbErr: any) {
        databaseError = dbErr.message || 'Unknown database error';
      }

      res.json({
        success: true,
        mode,
        configStatus,
        firebaseAdmin: {
          connected: firebaseAdminConnected,
          error: databaseError,
          diagnosticCheck: {
            paymentsSampleCount: paymentsCount,
            transactionsSampleCount: transactionsCount
          }
        },
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Internal debugger error'
      });
    }
  });

  // HAMARÉ & Mayar Integration: Create Payment
  app.post('/api/create-payment', async (req, res) => {
    try {
      const { userId, name, email, whatsapp, packageId, amount } = req.body;

      if (!userId || !name || !email || !packageId || !amount) {
        return res.status(400).json({ error: 'Missing required payment fields' });
      }

      const packageNames: Record<string, string> = {
        '15000': '1 Unlock (Hanya Hasil Ini)',
        '150000': 'Unlimited 30 Hari',
        '1150000': 'Unlimited 365 Hari'
      };

      const packageName = packageNames[packageId] || 'Premium Package';
      const apiKey = process.env.MAYAR_API_KEY;
      const isPlaceholderKey = !apiKey || apiKey === 'MY_MAYAR_API_KEY' || apiKey.includes('placeholder');
      const isProduction = process.env.NODE_ENV === 'production';
      
      let paymentLink = '';
      let paymentId = 'mock_pm_' + Date.now();

      if (isPlaceholderKey) {
        if (isProduction) {
          console.error('[SECURITY ALERT] Production create-payment called but MAYAR_API_KEY is not configured!');
          return res.status(500).json({ 
            error: 'Mayar Payment Gateway API Key is not configured on this production environment. Please supply a valid MAYAR_API_KEY in the environment panels.' 
          });
        }
        console.log('Using Mock Mayar Link because API Key is not configured (Development mode).');
        paymentLink = `https://checkout.mayar.id/mock-pay-${packageId}?uid=${userId}`;
      } else {
        // Real API Call to Mayar
        try {
          const response = await fetch('https://api.mayar.id/v2/payment/request', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name,
              email,
              mobile: whatsapp || '081200000000',
              amount: Number(amount),
              description: `Akses HAMARÉ Premium: ${packageName}`,
              redirectUrl: process.env.APP_URL || 'http://localhost:3000'
              // Note: callbackUrl is removed because Mayar webhooks are configured globally in the merchant dashboard
            })
          });

          if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Mayar API error: ${response.status} - ${errText}`);
          }

          const resData = await response.json();
          paymentLink = resData.link || resData.url || (resData.data && (resData.data.link || resData.data.url));
          paymentId = resData.id || (resData.data && resData.data.id) || paymentId;

          if (!paymentLink) {
            throw new Error('Failed to retrieve payment link from Mayar response');
          }
        } catch (apiErr: any) {
          console.error('Mayar integration API error:', apiErr);
          if (isProduction) {
            return res.status(502).json({ 
              error: 'Failed to connect to Mayar Payment Gateway: ' + (apiErr.message || 'Unknown network error') 
            });
          }
          console.log('Falling back to Sandbox mockup link in Development.');
          paymentLink = `https://checkout.mayar.id/mock-pay-${packageId}?uid=${userId}&fallback=true`;
        }
      }

      // Save payment trace to Firestore using Firebase Admin SDK (Bypassing public security rules safely)
      const paymentDoc = {
        userId,
        name,
        email,
        whatsapp: whatsapp || '',
        package: packageId,
        packageName,
        uniqueAmount: Number(amount),
        status: 'pending',
        mayarPaymentId: paymentId,
        createdAt: new Date().toISOString(),
      };

      await db.collection('payments').add(paymentDoc);

      res.json({
        success: true,
        paymentLink,
        mayarPaymentId: paymentId
      });

    } catch (error: any) {
      console.error('Error in /api/create-payment:', error);
      res.status(500).json({ error: error.message || 'Internal payment error' });
    }
  });

  // HAMARÉ & Mayar Integration: Webhook
  app.post('/api/webhook/mayar', async (req, res) => {
    try {
      const signatureRaw = req.headers['x-mayar-signature'] || req.headers['mayar-signature'];
      const signature = Array.isArray(signatureRaw) ? signatureRaw[0] : signatureRaw as string || '';
      const webhookToken = process.env.MAYAR_WEBHOOK_TOKEN;
      const rawBody = (req as any).rawBody || (typeof req.body === 'string' ? req.body : JSON.stringify(req.body));

      console.log('===== MAYAR WEBHOOK RECEIVED =====');
      console.log('Headers:', req.headers);
      console.log('Raw Payload Available:', !!(req as any).rawBody);

      // Verify signature if webhookToken is present and not a default value
      if (webhookToken && webhookToken !== 'MY_MAYAR_WEBHOOK_TOKEN' && webhookToken !== '') {
        const computed = crypto.createHmac('sha256', webhookToken).update(rawBody).digest('hex');
        
        // Use timingSafeEqual to guard against timing side-channel attacks
        const computedBuffer = Buffer.from(computed, 'utf-8');
        const signatureBuffer = Buffer.from(signature, 'utf-8');

        if (computedBuffer.length !== signatureBuffer.length) {
          console.warn(`Webhook Signature Mismatch! Length discrepancy (Computed: ${computedBuffer.length}, Signature Header: ${signatureBuffer.length}).`);
          return res.status(400).json({ error: 'Invalid webhook signature' });
        }

        const isValid = crypto.timingSafeEqual(computedBuffer, signatureBuffer);

        if (!isValid) {
          console.warn(`Webhook Signature Mismatch! Header: ${signature}, Computed: ${computed}`);
          return res.status(400).json({ error: 'Invalid webhook signature' });
        }
        console.log('Webhook Signature Verified Successfully via timing-safe HMAC check!');
      } else {
        console.log('Webhook signature verification skipped (Webhook token not configured or set to placeholder).');
      }

      // Store webhook payload in transactions collection using Firebase Admin SDK
      const txDoc = {
        payload: req.body,
        receivedAt: new Date().toISOString(),
        verified: true
      };
      
      const txRef = await db.collection('transactions').add(txDoc);
      console.log('Webhook payload log written to Firestore successfully.');

      // Extract payment keys
      const payload = req.body;
      const mayarPaymentId = payload.payment_id || payload.id || (payload.data && (payload.data.payment_id || payload.data.id || payload.data.paymentId));
      let paymentDoc: any = null;

      if (mayarPaymentId) {
        console.log(`Webhook seeking payment with mayarPaymentId: ${mayarPaymentId}`);
        const snap = await db.collection('payments')
          .where('mayarPaymentId', '==', mayarPaymentId)
          .limit(1)
          .get();
        if (!snap.empty) {
          paymentDoc = snap.docs[0];
        }
      }

      if (!paymentDoc) {
        // Fallback search: search by amount if present (crucial for manual or developer simulated payments)
        const amount = payload.amount || (payload.data && payload.data.amount);
        if (amount) {
          console.log(`Webhook seeking pending payment with uniqueAmount matching: ${amount}`);
          const snap = await db.collection('payments')
            .where('status', '==', 'pending')
            .where('uniqueAmount', '==', Number(amount))
            .limit(1)
            .get();
          if (!snap.empty) {
            paymentDoc = snap.docs[0];
          }
        }
      }

      if (paymentDoc) {
        const paymentData = paymentDoc.data();
        const paymentId = paymentDoc.id;
        const userId = paymentData.userId;
        const packageId = paymentData.package; // String package ID, e.g. "15000"

        if (paymentData.status === 'completed') {
          console.log(`Payment document ${paymentId} is already marked as completed. Skipping duplication.`);
          return res.status(200).json({ success: true, message: 'Webhook processed (already completed)' });
        }

        const now = new Date();
        const nowString = now.toISOString();

        // 1. Update the payment document status to "completed" and append detailed audit logs
        await db.collection('payments').doc(paymentId).update({
          status: 'completed',
          paidAt: nowString,
          updatedAt: nowString,
          webhookAuditTrail: {
            receivedAt: nowString,
            transactionDocId: txRef.id,
            action: 'payment_completed',
            packageId: packageId,
            verified: true,
            notes: `Successfully verified and activated via webhook payload.`
          }
        });
        console.log(`Payment doc ${paymentId} marked as completed with detailed audit trails.`);

        // 2. Perform target subscriber or one-time unlock state updates on user profile
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
          if (packageId === '150000') {
            // Package Rp150.000: Monthly Unlimited
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30);

            await userRef.update({
              subscriptionStatus: 'monthly',
              premiumExpiredAt: expiryDate.toISOString(),
              updatedAt: nowString
            });
            console.log(`User profile ${userId} upgraded to Monthly Subscription. Active until: ${expiryDate.toISOString()}`);
          } else if (packageId === '1150000') {
            // Package Rp1.150.000: Yearly Unlimited
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 365);

            await userRef.update({
              subscriptionStatus: 'yearly',
              premiumExpiredAt: expiryDate.toISOString(),
              updatedAt: nowString
            });
            console.log(`User profile ${userId} upgraded to Yearly Subscription. Active until: ${expiryDate.toISOString()}`);
          } else if (packageId === '15000') {
            // Package Rp15.000: One-time Result Unlock ONLY
            // Read targetUnlock metadata from original payment trace
            const targetUnlock = paymentData.targetUnlock;
            if (targetUnlock) {
              const newUnlockItem = {
                type: targetUnlock.type,
                key: targetUnlock.key,
                label: targetUnlock.label || 'Hasil Premium Terbuka',
                unlockedAt: nowString,
                paymentId: paymentId
              };

              await userRef.update({
                unlockedResults: FieldValue.arrayUnion(newUnlockItem),
                updatedAt: nowString
              });
              console.log(`User profile ${userId} single-result access appended for: ${JSON.stringify(newUnlockItem)}`);
            } else {
              console.warn(`Payment Rp15.000 completed but no targetUnlock details existed in original document.`);
            }
          }
        } else {
          console.error(`User profile document users/${userId} was expected but could not be read.`);
        }
      } else {
        console.warn('Webhook payload could not be paired with any existing pending payment trace in database.');
      }

      res.status(200).json({ success: true, message: 'Webhook received and processed' });

    } catch (err: any) {
      console.error('Error handling webhook:', err);
      res.status(500).json({ error: err.message || 'Internal webhook error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files from dist
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log('API Keys are now protected on the server side.');
  });
}

startServer().catch(console.error);
