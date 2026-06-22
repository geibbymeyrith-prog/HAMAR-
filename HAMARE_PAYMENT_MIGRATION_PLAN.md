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
