# HAMARÉ - PAYMENT GATEWAY & FIREBASE MIGRATION PLAN

Dokumen ini mendokumentasikan keputusan teknis, arsitektur, hasil audit backend, penjelasan hambatan integrasi Firebase Admin SDK, serta rencana migrasi lengkap dari sandbox AI Studio menuju proyek Firebase mandiri milik HAMARÉ untuk sistem pembayaran premium.

---

## 1. STATUS INTEGRASI MAYAR SAAT INI

Integrasi payment gateway Mayar di sisi backend (`server.ts`) telah diimplementasikan dengan fitur keamanan tangguh:
* **Lazy Initialization & Safe Fallback**: Server mendeteksi ketiadaan API Key (`MAYAR_API_KEY`) dan secara aman mengalihkan transaksi ke sirkuit pengujian sandbox link (mockup) dalam mode pengembangan (`development`), namun menolak transaksi di mode produksi (`production`) dengan status HTTP 500 demi mencegah eksploitasi.
* **Integrasi Webhook Aman**: `/api/webhook/mayar` telah dilengkapi verifikasi HMAC dengan verifikasi tanda tangan berbasis `crypto.timingSafeEqual` menggunakan token rahasia webhook (`MAYAR_WEBHOOK_TOKEN`). Hal ini mencegah serangan pemalsuan payload (*signature spoofing*) dan *timing side-channel attacks*.
* **Status Log & Trace**: Pembayaran yang diinisiasi disimpan di Firestore dalam koleksi `payments` (untuk tracing status transaksi) sedangkan muatan payload webhook mentah disimpan di koleksi `transactions` untuk log audit sistem.

---

## 2. HASIL AUDIT RUNTIME BACKEND

Pengujian fungsional backend menggunakan skrip uji runtime internal menghasilkan data real sebagai berikut:

* **Endpoint `GET /api/payment-test`**:
  * **HTTP Status**: `200 OK`
  * **Configuration Status**: 
    * `APP_URL`: Terkonfigurasi dengan benar (`https://ais-dev-alvgkoeuce6xeklwajhkmv-824023813445.asia-southeast1.run.app`)
    * `MAYAR_API_KEY`: Belum terkonfigurasi (`configured: false` / menggunakan placeholder bawaan dev)
    * `MAYAR_WEBHOOK_TOKEN`: Belum terkonfigurasi (`configured: false` / menggunakan placeholder bawaan dev)
  * **Firebase Admin Connection Status**: `connected: false` dengan pesan kesalahan: `7 PERMISSION_DENIED: Missing or insufficient permissions.`
  * **Sample Document Count**: `paymentsCount: 0`, `transactionsCount: 0`

* **Endpoint `POST /api/create-payment` (Dummy Payload)**:
  * **HTTP Status**: `500 Internal Server Error`
  * **Response Body**: `{"error": "7 PERMISSION_DENIED: Missing or insufficient permissions."}` (Terjadi kegagalan saat server mencoba menulis jejak pembayaran ke koleksi `payments` di Firestore menggunakan Admin SDK).

---

## 3. TEMUAN AUDIT DATABASE: SANDBOX AI STUDIO

Firestore yang digunakan oleh aplikasi saat ini sepenuhnya disandarkan pada infrastruktur sandbox otomatis yang dikelola platform AI Studio:

* **Project ID**: `gen-lang-client-0748393729`
* **Firestore Database ID**: `ai-studio-2cccb106-3906-44ad-8017-93b22833bd76`
* **Penyebab Firebase Admin SDK Gagal (`PERMISSION_DENIED`)**:
  1. Frontend (Firebase Client Web SDK) berjalan langsung di perambah pengguna dan diotorisasi menggunakan kredensial publik browser sesuai dengan aturan Firestore Security Rules (`firestore.rules`). Selama pengguna melakukan otentikasi di client, login sukses dan perizinan menulis dipertahankan.
  2. Backend (`server.ts`) berjalan di luar lingkungan Cloud Run default Firebase (diafiliasikan dalam lingkungan container terisolasi AI Studio). Ketika Firebase Admin SDK diinisiasi tanpa berkas kunci kredensial formal (Service Account JSON), Admin SDK mencoba mencari otentikasi mesin bawaan Google (Application Default Credentials / ADC).
  3. Namun, karena Admin SDK berjalan di container platform eksternal studio, ia tidak memiliki hak akses bawaan IAM apa pun terhadap Firestore sandbox milik AI Studio tersebut. Akibatnya, server ditolak dengan pesan kesalahan `PERMISSION_DENIED` saat mencoba melakukan operasi baca/tulis.

---

## 4. KEPUTUSAN ARSITEKTUR PRODUCTION

Untuk kelangsungan jangka panjang, kestabilan operasional, kebebasan pengelolaan, dan keamanan data finansial pengguna HAMARÉ, kita mengambil keputusan arsitektural berikut:

1. **Keluar dari Sandbox Firestore AI Studio**: Tidak menggunakan database sandbox otomatis milik AI Studio untuk production atau deployment asli. Sandbox ini rentan terhadap pembersihan sesi sepihak, pembatasan akses server/Admin SDK, dan mutasi skema dari luar.
2. **Migrasi ke Proyek Firebase Mandiri**: Memindahkan seluruh konfigurasi data backend, data keanggotaan pengguna, log transaksi, dan otentikasi (Auth) ke proyek Firebase baru milik HAMARÉ sendiri secara utuh.
3. **Pengamanan Otorisasi Admin SDK**: Menggunakan Service Account JSON aman milik proyek Firebase pribadi tersebut yang disisipkan ke dalam variabel rahasia (`FIREBASE_SERVICE_ACCOUNT_JSON`) di panel Secrets AI Studio. Ini menjamin server dapat memintas verifikasi keamanan secara legal (*bypass Firestore rules*) untuk menulis data pembayaran dan transaksi dari Mayar secara andal.

---

## 5. DOKUMEN CHECKLIST CONFIGURATION PROJECT BARU

Di dalam konsol Firebase pribadi milik HAMARÉ, pastikan untuk menyiapkan dan mengunduh konfigurasi berikut untuk dimasukkan ke bagian pengaturan aplikasi:

* [ ] **`projectId`**: ID unik proyek Firebase Anda (misal: `hamare-prod-xxxxx`).
* [ ] **`apiKey`**: Kunci API Web Firebase Client.
* [ ] **`authDomain`**: Domain otentikasi (gunakan domain kustom Anda `hamare.halokabhagya.com` jika diotorisasi di konsol Auth).
* [ ] **`appId`**: ID identifikasi aplikasi Web Firebase Anda.
* [ ] **`firestoreDatabaseId`**: `(default)` atau buat database ID bernama spesifik (direkomendasikan menggunakan database default).
* [ ] **`serviceAccountJson`**: Berkas Service Account JSON yang dibuat melalui Google Cloud Console IAM -> Service Accounts dengan hak akses sekurang-kurangnya **Firebase Firestore Admin**.

---

## 6. URUTAN LANGKAH EKSEKUSI MIGRASI (NEXT STEPS)

Berikut adalah peta jalan pengerjaan berikutnya untuk mewujudkan sistem pembayaran yang aman dan stabil:

1. **Langkah A: Membuat Firebase Project Baru**
   * Buat proyek baru di Firebase Console, aktifkan layanan **Authentication** (Metode Email/Password), serta aktifkan layanan **Cloud Firestore** dalam mode produksi (*production mode*).
2. **Langkah B: Membuat Service Account JSON**
   * Masuk ke *Project Settings* -> *Service Accounts* di Firebase Console. Klik *Generate New Private Key* untuk mengunduh kunci dalam format JSON.
3. **Langkah C: Konfigurasi Berkas Frontend**
   * Perbarui berkas `firebase-applet-config.json` di root proyek menggunakan konfigurasi client SDK dari Firebase Project baru Anda.
4. **Langkah D: Menyimpan Rahasia ke Secrets AI Studio**
   * Salin seluruh teks JSON di dalam berkas Service Account baru tersebut.
   * Daftarkan variabel rahasia baru di panel Secrets/Settings AI Studio dengan nama kunci: `FIREBASE_SERVICE_ACCOUNT_JSON` dan tempelkan JSON tersebut berserta tanda kurung kurawalnya.
5. **Langkah E: Deploy Aturan Keamanan Database**
   * Deploy aturan keamanan Firestore (`firestore.rules`) ke proyek baru agar sisi client frontend terlindungi dengan ketat.
6. **Langkah F: Verifikasi Status Diagnostik**
   * Akses kembali endpoint `GET /api/payment-test`.
   * Pastikan output JSON menunjukkan status sukses: `firebaseAdmin.connected: true`.
7. **Langkah G: Pengujian Inisiasi Pembayaran**
   * Lakukan pengujian pembuatan tautan pembayaran dengan memanggil `POST /api/create-payment`.
   * Pastikan dokumen tertulis sukses di Firestore baru Anda pada koleksi `payments` dan tautan Mayar berhasil digabungkan.
8. **Langkah H: Pengujian Webhook**
   * Simpan token webhook Mayar ke rahasia `MAYAR_WEBHOOK_TOKEN` AI Studio.
   * Lakukan simulasi callback webhook dan pastikan dokumen log mentah tercatat di koleksi `transactions`.
9. **Langkah I: Menghubungkan Antarmuka Paywall**
   * Integrasikan halaman `Paywall.tsx` di frontend agar memicu pemanggilan API riil `/api/create-payment` dan melacak transisinya secara real-time.
10. **Langkah J: Mengaktifkan Premium Unlock Logic**
    * Terapkan logika buka kunci akses fitur-fitur premium (Weton PDF, analisis kecocokan mendalam, dll) jika status pembayaran pengguna telah divalidasi `active` oleh Admin SDK.

---

## 7. CATATAN PENGEMBANGAN LOG SEGMEN WEBHOOK

Saat stabilitas integrasi database baru dinilai solid setelah siklus migrasi selesai, koleksi redundan log webhook mandiri bernama `webhook_logs` (atau perluasan di koleksi `transactions`) akan dioptimalkan guna mengklasifikasikan jejak respons API Mayar berdasarkan ID Pelanggan secara dinamis untuk memudahkan tim support melacak kegagalan bayar secara real-time.

---

## Stage 5 Production Hardening Audit

### 1. Duplicate Webhook Protection

#### Kode Aktual yang Mencegah Pemrosesan Ganda
Pencegahan pemrosesan ganda pada server ditekankan melalui pertahanan berikut di `/server.ts` (lines 396-407):
```typescript
        if (paymentData.status === 'completed') {
          console.log(`Payment document ${paymentId} is already marked as completed. Skipping duplication.`);
          procResult = 'Payment already marked as completed. No state updates performed.';
          if (initialLogId) {
            await db.collection('webhook_logs').doc(initialLogId).update({
              verified: signatureVerified,
              processingResult: procResult,
              paymentId: paymentId
            });
          }
          return res.status(200).json({ success: true, message: 'Webhook processed (already completed)' });
        }
```

#### Analisis Hambatan Keamanan Replay & Integrasi Ganda
1. **Apakah Pengecekan `paymentData.status === 'completed'` Cukup?**
   - **Dalam kondisi normal (Sekuensial):** Ya, sangat cukup. Jika Mayar mengirim panggilan ulang (retries akibat jaringan terputus atau respon tertunda) setelah beberapa waktu, deteksi status pembayaran akan menemukannya sebagai `'completed'`. Proses akan langsung dihentikan secara aman tanpa meng-upgrade hak keanggotaan ganda atau membukakan hasil weton beberapa kali, lalu memulangkan status `200 OK` agar Mayar tahu pengiriman terkonfirmasi.
   - **Dalam kondisi ekstrem (Konkurensi / Paralelisme):** Rentan terhadap *Race Conditions*. Jika Mayar mengirimkan callback berulang secara bersamaan dalam orde milidetik (misalnya karena dispatch asinkron paralel dari load balancer mereka), ada jeda waktu sekian milidetik saat kedua thread membaca status document yang masih tertulis `'pending'`. Keduanya akan lolos pemeriksaan ini dan mengeksekusi logika penambahan premium bersamaan.

#### Rekomendasi Penguatan Produksi:
* **Firestore Transaction:** Bungkus proses pembacaan status (`paymentDoc.get()`) dan pemutakhiran status (`payments.update()`) ke dalam **Firestore Transaction (`db.runTransaction()`)**. Ini menjamin transaksi dilakukan secara atomik di sisi server database, mencegah benturan data paralel.
* **Idempotency Key Document ID:** Mayar selalu melampirkan parameter ID unik (`payment_id`) untuk setiap transaksi. Daftarkan ID ini sebagai nama dokumen kunci pada koleksi terdedikasi `processed_webhooks`. Lakukan operasi `.create()` di awal webhook:
  ```typescript
  // Mencoba mendaftarkan ID Webhook secara unik
  try {
    await db.collection('processed_webhooks').doc(mayarPaymentId).create({ processedAt: new Date().toISOString() });
  } catch (err) {
    // Jika error "Already Exists", langsung pulangkan 200 OK
    return res.status(200).json({ success: true, message: 'Duplicate webhook bypassed' });
  }
  ```

---

### 2. Payment Matching Safety

#### Audit Kode Fallback Terpasang
```typescript
where('status', '==', 'pending')
where('uniqueAmount', '==', Number(amount))
```

#### Analisis Risiko Tabrakan Nominal yang Sama
Sistem memiliki harga paket statis (Rp15.000 untuk Unlock Tunggal, Rp150.000 untuk Bulanan, Rp1.150.000 untuk Tahunan). Di bawah beban tinggi, **banyak pengguna akan membuat pembayaran dengan nominal yang persis sama dalam waktu berdekatan.**

* **Skenario Risiko:** Jika *User A* dan *User B* sama-sama membuka kecocokan weton murni Rp15.000, keduanya memiliki status `pending` dan `uniqueAmount: 15000`. Saat webhook untuk *User A* masuk, jika dipaksa menggunakan fallback nominal (misalnya payload Mayar tidak memiliki `mayarPaymentId`), query pencarian murni akan mengambil data pertama (`.limit(1)`).
* **Dampak Tabrakan:** *User A* membayar, namun query secara tidak sengaja mencocokkan transaksi tersebut dengan dokumen milik *User B*. Akun *User B* akan terbuka secara ajaib (padahal belum membayar), sementara *User A* yang sah akan terkatung-katung dengan status belum terbayar.

#### Rekomendasi Produksi:
* **REKOMENDASI B: Hanya gunakan `mayarPaymentId` secara mutlak dan kirim kesalahan ke `webhook_logs` jika tidak ditemukan.**
* **Alasan Teknis:** Pengecekan berbasis nominal murni sangat berbahaya di fase produksi kecuali sistem Anda melahirkan angka nominal dinamis (contoh: tambahan angka acak unik di belakang koma / 3 digit terakhir seperti Rp15.023, Rp15.112 dst). Karena HAMARÉ menggunakan invoice API murni yang melahirkan tautan pembayaran eksklusif dari Mayar, maka parameter `mayarPaymentId` mutlak bersifat unik 1-ke-1 dan wajib dijadikan acuan utama. Jika tidak ditemukan kecocokan ID tersebut di database, simpan payload sebagai log peringatan dan biarkan diselesaikan secara manual oleh administrator agar tidak menukar hak akses pengguna lain.

---

### 3. Admin Recovery Workflow

#### Deteksi Masalah & Dashboard Monitoring
Fitur **Payment Monitoring** yang baru saja dibangun melacak technical log secara menyeluruh di bawah tab **Webhook Technical Logs**. Log technical ini melacak status webhook tidak berpasangan (*unmatched webhook callback*) dengan status tidak terverifikasi (Verified: False / Mismatch) dan memaparkan pesan penanganan: `Skipped: Webhook signature verified, but no matching pending payment in db with mayarPaymentId/amount`.

#### Desain Alur Pemulihan Operasional (Operational Recovery Workflow)
1. **Langkah 1 (Laporan):** Pelanggan menghubungi CS bahwa mereka telah membayar Rp15.000 namun weton analisis premiumnya masih belum terbuka.
2. **Langkah 2 (Pencarian Log):** Admin membuka halaman **Admin Dashboard -> PAYMENT MONITORING -> Webhook Technical Logs**. Admin mengetikkan email pelanggan atau ID Pembayaran Mayar pada kotak pencarian monitor.
3. **Langkah 3 (Audit Detil):** Admin mengklik baris log tersebut untuk membuka drawer detail. Di sana tertera data raw JSON HTTP Request Headers dan Payload yang valid dari Mayar untuk memastikan status transaksi sukses secara teoretis.
4. **Langkah 4 (Satu Klik Solusi):** 
   - Bila data transaksi ternyata ada di tabel aslinya, Admin menuju tab **Koleksi Payments**, cari data pembayaran tertunda, lalu klik tombol **"Approve"**.
   - Sistem akan langsung memutakhirkan status transaksi di database, memperluas status premium, memasukkan daftar unlocked results, dan menyembunyikan paywall seketika dari peramban client tanpa keterlambatan.

---

### 4. First Real Transaction Checklist

Sebelum meluncurkan sistem ke production, ikuti runutan checklist integrasi berikut:

* [ ] **Konfigurasi Environment Secrets di Console Settings AI Studio:**
  * Tambahkan API Key produksi sesungguhnya ke variabel `MAYAR_API_KEY`.
  * Tambahkan kunci token rahasia webhook asli ke variabel `MAYAR_WEBHOOK_TOKEN`.
* [ ] **Konfigurasikan Webhook Endpoint di Dashboard Developer Mayar:**
  * Masukkan tautan callback server production Anda: `https://[NAMA-APP-PRODUCTION-ANDA].run.app/api/webhook/mayar`.
* [ ] **Inisiasi Pembayaran Paket Rp15.000 Pertama:**
  * Buka aplikasi HAMARÉ sebagai salah satu user uji coba murni di client browser.
  * Klik tombol pembayaran paket "Unlock Hasil Weton Single Rp15.000" untuk mengarah ke portal checkout Mayar.
  * Selesaikan invoicing real / sandbox link senilai Rp15.000 tersebut sampai Mayar mengonfirmasi penyelesaian transfer sukses.
* [ ] **Verifikasi Perubahan Data Otomatis Backend:**
  * [ ] **Koleksi Payments:** Pastikan baris log penjelajah pembayaran berubah dari `pending` ke `completed` dan diisikan data `paidAt`.
  * [ ] **Status Premium User:** Pastikan dokumen UID user tersebut langsung terisi objek weton baru dalam array `unlockedResults`.
  * [ ] **Webhook Technical Logs:** Pastikan tercipta log baru berlabel `verified: true` dengan processing result murni: *Successfully verified. Unlocked single-result metadata...*.
* [ ] **Verifikasi Pengalaman visual Pengguna:**
  * Kembali ke halaman antarmuka weton pengguna yang melakukan transaksi.
  * Pastikan pelindung transisi paywall tertutup secara dinamis dan instan tanpa perlunya menuntut penyegaran halaman web (*no hard refresh needed*).

