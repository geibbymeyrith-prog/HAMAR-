# HAMARÉ - PROJECT KNOWLEDGE BASE

Dokumen ini merupakan pusat pengetahuan (*Knowledge Base*) komprehensif untuk proyek **HAMARÉ**. Dokumen ini mengaudit, merapikan, dan mencatat seluruh aturan bisnis, formula matematika, sistem rujukan kalender, algoritma primbon, struktur database, arsitektur UI/branding, serta asumsi sistem yang digunakan dalam aplikasi.

---

# DAFTAR ISI
1. [MODUL 1: ATURAN BISNIS & MEMBERSHIP](#modul-1-aturan-bisnis--membership)
2. [MODUL 2: KALENDER MASEHI & SISTEM KONVERSI](#modul-2-kalender-masehi--sistem-konversi)
3. [MODUL 3: KALENDER TANGGAL JAWA](#modul-3-kalender-tanggal-jawa)
4. [MODUL 4: KALENDER PRANATA MANGSA](#modul-4-kalender-pranata-mangsa)
5. [MODUL 5: GISIR HARIAN](#modul-5-gisir-harian)
6. [MODUL 6: HARI & PASARAN (DINÅ & PASARAN)](#modul-6-hari--pasaran-din-pasaran)
7. [MODUL 7: HARI & LAMBANG](#modul-7-hari--lambang)
8. [MODUL 8: PASARAN & DEWA](#modul-8-pasaran--dewa)
9. [MODUL 9: SIFAT HARI (WATAK DINÅ)](#modul-9-sifat-hari-watak-din)
10. [MODUL 10: SIFAT PASARAN (WATAK PASARAN)](#modul-10-sifat-pasaran-watak-pasaran)
11. [MODUL 11: TAHUN SAKA JAWA](#modul-11-tahun-saka-jawa)
12. [MODUL 12: SIKLUS WINDU](#modul-12-siklus-windu)
13. [MODUL 13: LAMBANG TAHUN](#modul-13-lambang-tahun)
14. [MODUL 14: NAGADINA & MEDITASI](#modul-14-nagadina--meditasi)
15. [MODUL 15: WARNA HARI KOSMOLOGI](#modul-15-warna-hari-kosmologi)
16. [MODUL 16: WETON HARI KELAHIRAN & GRAFIK PENGHIDUPAN](#modul-16-weton-hari-kelahiran--grafik-penghidupan)
17. [MODUL 17: JODOH PINASTI (PRONOTOSRI & HITUNG NAMA)](#modul-17-jodoh-pinasti-pronotosri--hitung-nama)
18. [MODUL 18: PERHITUNGAN HARI BAIK](#modul-18-perhitungan-hari-baik)
19. [MODUL 19: HITUNG NAMA AKSARA JAWA (HANACARAKA)](#modul-19-hitung-nama-aksara-jawa-hanacaraka)
20. [MODUL 20: STATISTIK KUNJUNGAN REAL-TIME](#modul-20-statistik-kunjungan-real-time)
21. [MODUL 21: BULAN JAWA & GREGORIAN INTER-OPERABILITY](#modul-21-bulan-jawa--gregorian-inter-operability)
22. [MODUL 22: DEWA HARIAN](#modul-22-dewa-harian)
23. [MODUL 23: SIKLUS WUKU (30 PEKAN)](#modul-23-siklus-wuku-30-pekan)
24. [MODUL 24: PADEWAN (SULINGGgIHAN DEWA)](#modul-24-padewan-sulingggihan-dewa)
25. [MODUL 25: PADANGON (9 SIFAT ELEMENTAL)](#modul-25-padangon-9-sifat-elemental)
26. [MODUL 26: HARI NAAS HARIAN (SADWARA)](#modul-26-hari-naas-harian-sadwara)
27. [MODUL 27: PDF ENGINE & EXPORT RULES](#modul-27-pdf-engine--export-rules)
28. [MODUL 28: NARASI & PENERJEMAHAN WISDOM](#modul-28-narasi--penerjemahan-wisdom)
29. [MODUL 29: DATABASE & FIREBASE CONFIGURATION](#modul-29-database--firebase-configuration)
30. [MODUL 30: UI, BRANDING & RHYTHMIC DESIGN](#modul-30-ui-branding--rhythmic-design)
31. [MODUL 31: DAFTAR ASUMSI UTAMA SISTEM](#modul-31-daftar-asumsi-utama-sistem)

---

## MODUL 1: ATURAN BISNIS & MEMBERSHIP

Aplikasi HAMARÉ menerapkan sistem pembatasan kuota, otentikasi pengguna, dan paywall berlangganan dengan ketentuan sebagai berikut:

### 1. Kuota Pengguna Tamu (Guest Quota)
* **Aturan Kuota**: Pengguna tanpa login (Tamu/Guest) dibatasi maksimal melakukan **3 kali perhitungan** di seluruh platform.
* **Mekanisme**: Sisa kuota dilacak menggunakan kunci `hamare_guest_quota` di dalam `localStorage`. Apabila batas dihitung terlampaui, sistem otomatis memunculkan modal penawaran keanggotaan (`src/components/MemberOfferModal.tsx`).

### 2. Akun Anggota Terdaftar (Registered Members)
* **Keuntungan**: Riwayat perhitungan tersimpan secara permanen di database Cloud Firestore (`collection('history')`).
* **Sistem Kuota**: Akun gratis yang sudah terdaftar tetap memiliki hak hitung dasar tertentu, namun seluruh transaksi tidak akan memotong kuota tamu gratis.

### 3. Paket Berlangganan Premium
Pembelian paket premium dilakukan di halaman paywall (`src/components/Paywall.tsx`):
1. **Paket 1 Unlock (Hanya Hasil Ini)**:
   * **ID Paket**: `15000`
   * **Harga Dasar**: Rp 15.000,-
2. **Paket Unlimited 30 Hari**:
   * **ID Paket**: `150000`
   * **Harga Dasar**: Rp 150.000,-
3. **Paket Unlimited 365 Hari**:
   * **ID Paket**: `1150000`
   * **Harga Dasar**: Rp 1.150.000,-

### 4. Sistem Pembayaran & Verifikasi Manual
* **Kode Unik**: Setiap pembayaran otomatis ditambahkan 3 digit angka acak (1-999) di ujung nominal sebagai kode identifikasi transfer (contoh: paket Rp 15.000,- menjadi Rp 15.421,-).
* **Rekening Tujuan**:
  * **Bank**: BCA (Bank Central Asia)
  * **No. Rekening**: `1371225981`
  * **Atas Nama**: Geibby Meyrith Bolang
* **Konfirmasi WhatsApp**: Verifikasi dilakukan secara manual oleh Admin utama melalui tautan WhatsApp ke nomor `0812-9999-6816`. Pengguna mengirimkan format pesan persetujuan yang berisi Nama, Email, WhatsApp, Nama Paket, dan Nominal Unik yang ditransfer. Status di koleksi `payments` kemudian akan diubah dari `pending` menjadi `active` oleh Admin di Dashboard.

---

## MODUL 2: KALENDER MASEHI & SISTEM KONVERSI

Sistem HAMARÉ menerima input tanggal berbasis kalender Gregorian (Masehi) dan menggunakan fungsi-fungsi standar pustaka untuk menangani operasi penanggalan:

### 1. Tahun Kabisat & Hari Bulan
* Menggunakan standar penanggalan Masehi dengan aturan 365/366 hari per tahun. Penentuan tahun kabisat dilakukan lewat evaluasi matematis standar (`isLeapYear` dari `date-fns` atau fungsi pembagi modulus `4`).
* Pengecualian Tanggal: Tanggal kabisat khusus seperti 29 Februari diabaikan dalam sisa putaran sirkular internal tertentu untuk mencegah pergeseran offset tahunan (misalnya dalam siklus Pranata Mangsa murni).

### 2. Format & Lokatisasi (Locale)
* Mengacu pada representasi penanggalan bahasa Indonesia. Nama-nama hari Masehi standar didefinisikan secara eksplisit: `['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']`.

---

## MODUL 3: KALENDER TANGGAL JAWA

Perhitungan hari dan bulan dalam Kalender Jawa murni dirumuskan dengan menggunakan siklus modular berkelanjutan bebas revisi tahun lompat:

### 1. Konfigurasi Siklus
* **Panjang Siklus Tahun Jawa murni**: 354 hari per tahun.

### 2. Koordinat Acuan (Anchor Date)
* **Tanggal Acuan Masehi**: 1 Mei 2025.
* **Tanggal Acuan Jawa**: Hari ke-298 dalam siklus tahunan Jawa (yang bersesuaian dengan tanggal 3 Sela pada tahun Jawa tersebut).

### 3. Rumusan Perhitungan (`getJavaDate`)
```typescript
const totalYearDaysJava = 354;
const refDateJava = new Date(2025, 4, 1); // 1 Mei 2025 (bulan di JS adalah 0-indexed)
const refDayIdxJava = 298; // Hari ke-298 dalam siklus tahunan

const diffTime = target.getTime() - refDateJava.getTime();
const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
let currentTotalDays = (refDayIdxJava + diffDays) % totalYearDaysJava;

if (currentTotalDays <= 0) currentTotalDays += totalYearDaysJava;
```

### 4. Pembagian Hari ke dalam Bulan Jawa (JAVA_MONTHS)
Setiap bulan dalam tahun Jawa murni didefinisikan memiliki panjang hari yang konstan bergantian:
1. Sura: 30 hari
2. Sapar: 29 hari
3. Mulud: 30 hari
4. Bakda Mulud: 29 hari
5. Jumadil Awal: 30 hari
6. Jumadil Akir: 29 hari
7. Rejeb: 30 hari
8. Ruwah: 29 hari
9. Pasa: 30 hari
10. Sawal: 29 hari
11. Sela: 30 hari
12. Besar: 29 hari

---

## MODUL 4: KALENDER PRANATA MANGSA

Siklus Pranata Mangsa erat kaitannya dengan musim tani tradisional Jawa. Hambatan konversi diatur menggunakan dua pendekatan matematis demi presisi maksimal:

### 1. Pendekatan Rentang Tanggal Gregorian/Masehi (`getMangsaFromDate`)
Bulan dan tanggal Masehi pengguna dicocokkan secara langsung ke dalam batasan statistik letak matahari berikut:
* **Kartika-Kasa** (Kasa): 22 Juni - 1 Agustus (41 hari) - *Ibarat: Sotya Sinarawedi*
* **Pusa-Karo** (Karo): 2 Agustus - 24 Agustus (23 hari) - *Ibarat: Bantolo Rengko*
* **Manggasri-Katelu** (Katelu): 25 Agustus - 17 September (24 hari) - *Ibarat: Suto Manut ing Bopo*
* **Sitra-Kapat** (Kapat): 18 September - 12 Oktober (25 hari) - *Ibarat: Waspo Kumembeng jroning Kalbu*
* **Manggala-Kalima** (Kalima): 13 Oktober - 8 November (27 hari) - *Ibarat: Pancuran Emas Sumawur ing Jagad*
* **Naya-Kanem** (Kanem): 9 November - 21 Desember (43 hari) - *Ibarat: Roso Mulyo Kasucian*
* **Palguna-Kapitu** (Kapitu): 22 Desember - 2 Februari (43 hari) - *Ibarat: Wiso Kentas ing Maruto*
* **Wasika-Kawolu** (Kawolu): 3 Februari - 28 Februari (25 hari) - *Ibarat: Anjrah jroning Kayun*
* **Jita-Kasanga** (Kasanga): 1 Maret - 25 Maret (25 hari) - *Ibarat: Wedharing Wacana Mulyo*
* **Srawana-Kasedasa** (Kasedasa): 26 Maret - 18 April (24 hari) - *Ibarat: Gedhong Minep jroning Kayun*
* **Padrawana-Dhesta** (Dhesta): 19 April - 11 Mei (23 hari) - *Ibarat: Sotya Mulya ing Sasana*
* **Asuji-Sadda** (Sadda): 12 Mei - 21 Juni (41 hari) - *Ibarat: Tirta Sah saking Sasana*

### 2. Pendekatan Akurasi Hari Siklus (`getPMDate`)
* **Sistem Acuan**: Menggunakan tanggal 1 Maret sebagai jangkar tahunan utama.
* **Perhitungan**: Menghitung selisih hari dari 1 Maret tahun bersangkutan (atau tahun sebelumnya jika berada di Januari-Februari).
* **Urutan Mengalir (PM_ORDERED)**: Siklus berjalan berurutan mulai dari *Jita-Kasanga (25)*, *Srawana-Kasedasa (24)*, *Destha-Pradawana (23)*, *Sadda-Asuji (41)*, *Kasa-Kartika (41)*, dan seterusnya, menyusun total sirkulasi tahunan seimbang.

---

## MODUL 5: GISIR HARIAN

Gisir Harian melambangkan ritme pasang-surut aura energi atau watak harian dalam metafisika Jawa (sering disebut juga Sifat Hari / Sifat Alami Bumi):

### 1. Struktur Siklus 6 Harian (Sadwara-Gisir)
Urutan sifat berulang secara periodik:
1. `Ringkel` (Index 0)
2. `Sonya` (Index 1)
3. `Donya` (Index 2)
4. `Malihan` (Index 3)
5. `Sonya` (Index 4)
6. `Nyawa` (Index 5)

### 2. Jangkar Matematis (Anchor Date)
* **Tanggal Acuan**: 27 Januari 2026.
* **Watak Acuan Tanggal tersebut**: `Malihan` (Index 3).

### 3. Rumusan Perhitungan Bebas Timezone
Menggunakan metode hitungan UTC absolut agar tidak terjadi pergeseran hari akibat perbedaan lokal penjelajah web pengguna:
```typescript
const gisirAnchor = new Date(2026, 0, 27); // 27 Jan 2026
const utc1 = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
const utc2 = Date.UTC(gisirAnchor.getFullYear(), gisirAnchor.getMonth(), gisirAnchor.getDate());
const gisirDaysDiff = Math.floor((utc1 - utc2) / (1000 * 60 * 60 * 24));
const gisirIdx = ((gisirDaysDiff % 6) + 6 + 3) % 6;
return SIFAT_LIST[gisirIdx];
```

---

## MODUL 6: HARI & PASARAN (DINÅ & PASARAN)

Weton dihitung dari perpaduan hari masehi (atau hari Jawa pitu) dengan sistem pasaran panca wara:

### 1. Struktur Pitung Dinå (7 Hari Jawa)
Sistem nilai (Neptu) berturut-turut:
* **Radite** (Minggu): Value `5`
* **Soma** (Senin): Value `4`
* **Anggara** (Selasa): Value `3`
* **Budda** (Rabu): Value `7`
* **Respati** (Kamis): Value `8`
* **Sukra** (Jumat): Value `6`
* **Tumpak** (Sabtu): Value `9`

### 2. Struktur Panca Wara (5 Pasaran Jawa)
Siklus pasaran berurutan beserta neptunya:
* **Pahing - Jenih**: Value `9`
* **Pon - Abrit**: Value `7`
* **Wage - Cemeng**: Value `4`
* **Kliwon - Mancawarna**: Value `8`
* **Legi - Pethak**: Value `5`

### 3. Koordinat Acuan & Rumusan Pasaran (`getPasaran`)
* **Arah Acuan**: 23 Mei 1982.
* **Hari Acuan tersebut**: Hari Wage (Posisi Index 1 dalam daftar sirkular `Pon, Wage, Kliwon, Legi, Pahing`).
* **Formula Perhitungan**:
  ```typescript
  const refDate = new Date(1982, 4, 23); // 23 Mei 1982
  const diffDays = Math.round((target.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
  let idx = (1 + diffDays) % 5;
  if (idx < 0) idx += 5;
  return PASARAN_LIST[idx]; 
  ```

---

## MODUL 7: HARI & LAMBANG

Setiap hari dalam sepekan dihubungkan secara kosmologis dengan benda langit atau elemen elemental kehidupan:

* **Minggu (Radite)**: Lambang **Surya** (Matahari) - Elemen sumber kehidupan, bersinar utama.
* **Senin (Soma)**: Lambang **Candra** (Bulan) - Elemen penuntun malam, lembut, indah, penuh simpati bagi sesama.
* **Selasa (Anggara)**: Lambang **Kartika** (Bintang) - Elemen penunjuk arah jarak jauh, tinggi, berserakan namun kokoh dalam pendirian.
* **Rabu (Budda)**: Lambang **Bantala** (Bumi) - Elemen fondasi kokoh, menampung, memberi pertumbuhan, sabar pemomong.
* **Kamis (Respati)**: Lambang **Tirta** (Air) - Elemen penyejuk, fleksibel namun berbobot besar menghanyutkan jika terpancing emosi.
* **Jumat (Sukra)**: Lambang **Angin** (Udara) - Elemen dinamis, bergerak merata, menyejukkan, terkadang bergerak tak terduga sangat cepat.
* **Sabtu (Tumpak)**: Lambang **Hakni** (Api) - Elemen membara, membakar antusiasme, berwatak kaku dan sulit ditebak arah kobarannya.

---

## MODUL 8: PASARAN & DEWA

Setiap nilai pasaran dikuasai dan mendapat berkah karakteristik spiritual dari dewa-dewa penunggu alam semesta utama Jawa:

1. **Pahing**: Dilindungi oleh **Dewa Brahma**
   * *Watak kosmologis*: Sang Pencipta, rupa warna Jenar (kuning keemasan), menghadap ke selatan. Karakteristik kelahiran: Berjiwa luhur, berhitung laba-rugi matang, penuh pertimbangan, mudah marah bila dikhianati.
2. **Pon**: Dilindungi oleh **Dewa Kala**
   * *Watak kosmologis*: Penguasa Waktu, rupa warna Abrit (merah), menghadap ke barat. Karakteristik kelahiran: Kritis, bertenaga besar, pandai berbicara di depan umum, teguh melangkah menantang tirani atasan.
3. **Wage**: Dilindungi oleh **Dewa Wisnu**
   * *Watak kosmologis*: Sang Pemelihara, rupa warna Cemeng (hitam), menghadap ke utara. Karakteristik kelahiran: Penurut, tekun memelihara aturan, rupawan penarik hati, cenderung pasif dalam mencari nafkah mandiri.
4. **Kliwon**: Dilindungi oleh **Bathara Guru** (Sang Hyang Manikmaya)
   * *Watak kosmologis*: Pemusnah kebatilan/Pelebur keterpurukan, rupa warna Mancawarna (multi-warna), berstatus di pusat. Karakteristik kelahiran: Berwawasan luas penuh gagasan cemerlang, sangat komunikatif bergaul, menepati janji ketat.
5. **Legi**: Dilindungi oleh **Bathari Sri** (Dewi Kesuburan)
   * *Watak kosmologis*: Sang Penggerak kehidupan, rupa warna Pethak (putih), menghadap ke timur. Karakteristik kelahiran: Bertanggung jawab agung, gemar memberi kesenangan pada kerabat, optimis, pantang mengeluh lelah di malam hari.

---

## MODUL 9: SIFAT HARI (WATAK DINÅ)

Penyimpulan perilaku harian berdasarkan nama hari Jawa (DAYS_SIFAT):

* **Radite (Minggu) — Meneng (diam)**: Karakteristik bertumpu pada kontrol panca indera mandiri, berniat tangguh, dan teguh dalam kesepian proses pengerjaan sesuatu secara otodidak.
* **Soma (Senin) — Maju**: Karakteristik menyukai dinamisme perubahan laku, lentur beradaptasi, berwajah estetik yang menenangkan, serta ahli memikat rasa welas asih.
* **Anggara (Selasa) — Mundur**: Menyimpan api pergaulan berkobar, mudah terbakar api cemburu, bernafas lekas, memiliki lingkar relasi luas, dan lekas tanggap terhadap ancaman eksternal.
* **Budda (Rabu) — Mangiwa (Ke Kiri)**: Sifat dingin kebapakan/keibuan (pemomong), senang menampung keluhan orang sekeliling, pendiam berwibawa, penyimpan pengetahuan berharga.
* **Respati (Kamis) — Manengen (Ke Kanan)**: Tunduk pada aturan agung lakuning urip bener sing pener, mengerikan saat marah besar, menguasai teknik negosiasi berat.
* **Sukra (Jumat) — Munggah (Naik)**: Menyukai perjalanan menapak kasta atas kehidupan, selalu bertenaga tangguh, dipenuhi rasa ingin tahu intelektual yang tinggi.
* **Tumpak (Sabtu) — Tumurun (Turun)**: Pembawa kabar gembira dari alam bawah sadar, sangat misterius untuk dipahami isi hati terdalamnya, pembimbing spritualitas mandiri.

---

## MODUL 10: SIFAT PASARAN (WATAK PASARAN)

Watak dasar bawaan pasaran menurut primbon asli HAMARÉ:

* **Pahing (Jenar - Merah Kekuningan)**: Selalu penuh dorongan memiliki barang, sangat rapi menyusun rencana tabungan, kuat menderita kelaparan fisik, jika marah menakutkan bagaikan badai api berkobar.
* **Pon (Abrit - Merah)**: Perkataannya lugas, berani mendebat pandangan umum jika melanggar kaidah hati nurani pribadi, mandiri dan enggan memakan hak yang bukan miliknya.
* **Wage (Cemeng - Hitam)**: Tegap setia mengabdi, berpenampilan kalem mempesona, memerlukan petunjuk orang terdekat agar tidak tersesat dalam perangkap fitnah jahat dunia luar.
* **Kliwon (Kasih - Banyak Warna)**: Sangat diplomatis menyuarakan hak kaum lemah, gemar bepergian mencari kemandirian, urakan namun lurus memegang sumpah luhur janji.
* **Legi (Manis - Putih)**: Penuh tata krama, selalu tersenyum seolah beban dunia tidak ada di bahunya, tahan terjaga hingga akhir malam sebagai pengabdi ilmu yang konsisten.

---

## MODUL 11: TAHUN SAKA JAWA

Pencatatan silsilah siklus 8 tahun dalam siklus penanggalan peradaban Jawa Islam:

### 1. Urutan Nama Tahun (Asadwara)
Terdapat 8 siklus tahun Saka:
1. `Alip` (Ada-ada / Niat)
2. `Ehe` (Tumandang / Bekerja)
3. `Jimawal` (Gawe / Proses)
4. `Je` (Lelakon / Ujian Nasib)
5. `Dal` (Urip / Sakralitas Introspeksi)
6. `Be` (Bola-bali / Konsistensi)
7. `Wawu` (Marang / Arah & Fokus)
8. `Jimakir` (Suwung / Evaluasi & Akhir Siklus)

### 2. Formulasi Perhitungan (`getJavaneseYearDetails`)
* **Koordinat Acuan**: Tahun Masehi 2025.
* **Tahun Jawa Acuan**: 1958 Jawa.
* **Urutan Index Acuan**: 2025 disesuaikan dengan posisi index `3` (`Je`).
* **Rumusan Algoritma**:
  ```typescript
  const refMasehi = 2025;
  const refJavaYear = 1958;
  const refIndex = 3; // 'Je'
  const diff = masehiYear - refMasehi;
  const javaYear = refJavaYear + diff;
  let javaIndex = (refIndex + diff) % 8;
  if (javaIndex < 0) javaIndex += 8;
  ```

---

## MODUL 12: SIKLUS WINDU

Windu adalah siklus besar Javanese Era yang mencakup 8 tahun penanggalan Saka Jawa (merupakan representasi pergerakan siklus kosmis orbit planet Yupiter sekitar 12 tahun):

### 1. Daftar 4 Windu Berurutan
Siklus perulangan Windu:
1. **Adi**: Berarti "Utama". Pengaruh pancaran kosmis membawa dorongan penemuan baru, kemakmuran, dan kebangkitan usaha mulia.
2. **Kunthara**: Berarti "Kelakuan". Siklus yang mendorong perubahan gaya hidup sosial masyarakat baru, kerja fisik keras menembus kendala krisis.
3. **Sangara**: Berarti "Banjir/Bencana alamiah". Keberuntungan kosmis terletak pada tindakan defensif menyingkirkan energi negatif, evaluasi bahaya, perlindungan diri.
4. **Sancaya**: Berarti "Mengumpulkan/Refleksi". Siklus pengumpulan energi bekal untuk persiapan lompatan siklus besar berikutnya.

### 2. Rumusan Perhitungan Windu
```typescript
const winduIndex = ((Math.floor((year - 2021) / 8) % 4) + 4 + 3) % 4;
return WINDU[winduIndex];
```

---

## MODUL 13: LAMBANG TAHUN

Lambang Tahun berputar setiap 8 tahun sekali yang merepresentasikan keseimbangan siklus tanah (bumi) dengan energi langit:

### 1. Klasifikasi 2 Lambang Tahun
* **Langkir**: Menuntut manusia menghargai berjalannya waktu, menggerakkan kesadaran bahwa hidup fana ini terus bermutasi dinamis menuju keluhuran kepribadian.
* **Kulawu**: Menuntut kebebasan dari kegelapan akal sehat, berhemat menjauhi boros liar, menolak insting impulsif yang berpotensi merusak hubungan kekeluargaan jangka panjang.

### 2. Rumusan Matematika Lambang
```typescript
const lambangIndex = ((Math.floor((year - 2021) / 8) % 2) + 2 + 1) % 2;
return LAMBANG[lambangIndex];
```

---

## MODUL 14: NAGADINA & MEDITASI

Nagadina (Naga Hari) menerangkan posisi kedudukan spritual energi alam semesta harian demi kelancaran hajat penting manusia:

### 1. Pembagian Arah Berdasarkan Neptu (`getNagadina`)
Perhitungan sisa pembagian bilangan neptu hari terhitung oleh modulus `4`:
* Sisa `0`: Kedudukan di **Utara** (Pangeran Penjaga: Wisnu)
* Sisa `1`: Kedudukan di **Timur** (Pangeran Penjaga: Sri)
* Sisa `2`: Kedudukan di **Selatan** (Pangeran Penjaga: Brahma)
* Sisa `3`: Kedudukan di **Barat** (Pangeran Penjaga: Kala)

### 2. Penyelarasan Posisi Meditasi
* **Aturan Meditasi Agung**: Meditasi spritual harian sebaiknya mempertemukan posisi wajah (menghadap) searah dengan letak kedudukan Nagadina hari bersangkutan guna menyerap pancaran keseimbangan energi bumi terkuat.
* **Zona Pantangan**: Hindari melakukan bepergian jauh ke arah persemayaman *Dewa Kala* (Barat) apabila posisi Nagadina hari tersebut sedang diduduki energi negatif murni.

---

## MODUL 15: WARNA HARI KOSMOLOGI

Masing-masing hari dan arah geospasial diselimuti getaran frekuensi spektrum cahaya kosmis (berdasar prinsip Kiblat Papat Kalima Pancer):

* **Utara**: Memiliki spektrum warna **Hitam** (menyerap energi, melambangkan kedalaman kebijaksanaan murni, pemeliharaan batin).
* **Timur**: Memiliki spektrum warna **Putih** (memancarkan ketenangan kesucian, kemurnian niat awal melangkah).
* **Selatan**: Memiliki spektrum warna **Kuning** (melambangkan kegemilangan cita-cita, keagungan kedudukan spiritual, kehormatan).
* **Barat**: Memiliki spektrum warna **Merah** (melambangkan keberanian, api nafsu, pergerakan destruktif pembersihan siklus usang).

---

## MODUL 16: WETON HARI KELAHIRAN & GRAFIK PENGHIDUPAN

Fungsi kalkulator Weton utama di HAMARÉ (`getJavaneseDetails`) mengembalikan kesimpulan kepribadian lengkap beserta peta perjalanan rejeki seumur hidup pengguna:

### 1. Struktur Peta Rejeki 6 Tahunan (`PENGHIDUPAN_DATA`)
Keberuntungan finansial dan kesehatan spiritual manusia terbagi ke dalam peta siklus 6 tahunan (umur 0 s.d. 78 tahun) dengan bobot angka keberuntungan `0` (Krisis) hingga `8` (Kejayaan Penuh):

```typescript
const PENGHIDUPAN_DATA = [
  { minAge: 0, maxAge: 6, neptuMap: { 10: 1, 11: 2, 12: 0, 13: 3, 14: 1, 15: 2, 16: 0, 17: 1, 18: 2, ... } },
  ...
];
```
Setiap neptu weton (misal Neptu `13` milik Minggu Kliwon) dipetakan secara matematis ke dalam fluktuasi nilai indeks ini:
* **Nilai 0 — 1**: Krisis Penghidupan. Sangat disarankan prihatin, mengurangi pengeluaran konsumtif, mendekatkan diri pada Sang Pencipta.
* **Nilai 2 — 4**: Kondisi Stabil/Semenjana. Rejeki cukup untuk hidup tenang sehari-hari, waktu terbaik melatih keterampilan baru.
* **Nilai 5 — 8**: Kejayaan Puncak/Kemudahan Rejeki. Waktu optimal memulai ekspansi usaha, menolong sesama yang kesusahan.

---

## MODUL 17: JODOH PINASTI (PRONOTOSRI & HITUNG NAMA)

Evaluasi kecocokan pernikahan dihitung melalui penggabungan dua lapis filter kuno:

### Metodologi 1: Kecocokan Berdasarkan Pranata Mangsa (`getJodohPinasti`)
Mencocokkan karakteristik musim kelahiran masing-masing pihak untuk melacak level keharmonisan perkawinan secara alamiah:

* **Saling Berjodoh (Status JODOH PINASTI)**:
  * *Kartika-Kasa* berjodoh dengan *Manggala-Kalima*
  * *Pusa-Karo* berjodoh dengan *Srawana-Kasedasa*
  * *Manggasri-Katelu* berjodoh dengan *Palguna-Kapitu*
  * *Sitra-Kapat* berjodoh dengan *Wasika-Kawolu*
  * *Jita-Kasanga* berjodoh dengan *Asuji-Sadda*
  * *Padrawana-Dhesta* berjodoh dengan *Manggasri-Katelu*
* **Kategori Serasi (SERASI)**: Terdapat sirkulasi kompatibilitas elemen yang saling mendukung. Pernikahan aman dibangun dari pondasi komunikasi yang terjaga.
* **Kategori Kendala (KENDALA)**: Elemen musim berlawanan tajam. Disarankan meredam ego, rajin berpuasa weton pernikahan, dan melakukan lelaku ritual *Seratan Winadi*.

### Metodologi 2: Kecocokan Angka Nama (`calculateJodohNama`)
Menghitung selisih pembagian neptu huruf aksara Jawa konsonan kedua belah pihak dengan pembagi modulo `7`:
* Sisa `1`: **Tunggak Semi** (Rejeki rumah tangga melimpah, mengembang terus).
* Sisa `2`: **Pisang Pinugel** (Kerawanan badai perpisahan atau rintangan hidup di pertengahan jalan pernikahan).
* Sisa `3`: **Lumbung Gung** (Kekayaan harta melimpah ruah, kecukupan pangan prima).
* Sisa `4`: **Sanggar Waringin** (Menjadi pengayom dan penyejuk bagi kerabat keluarga besar).
* Sisa `5`: **Pendaringan Kebak** (Keberkahan sandang pangan melimpah tak pernah habis).
* Sisa `6`: **Satriya Wibawa** (Mendapat derajat kemuliaan tinggi, dihormati masyarakat sekeliling).
* Sisa `7`: **Pandhita / Pandikta** (Penuh kebijaksanaan, tempat berkonsultasi rohani).

---

## MODUL 18: PERHITUNGAN HARI BAIK

Algoritma pencarian hari menguntungkan mengevaluasi bobot spiritual tanggal target untuk meminimalkan paparan energi negatif:

### Lapis Filter Hari Baik:
1. **Deteksi Naas Harian (`naas`)**: Memastikan target hari tidak bertepatan dengan Hari Naas (bencana) dari sub-siklus tubuh, daun, atau biji.
2. **Watak Gisir Harian (`gisir`)**: Menghindari hari yang berwatak `Ringkel` (Kelemahan rintangan) dan mengutamakan hari herwatak `Donya` atau `Nyawa` (Keluhuran rejeki, kesegaran jiwa).
3. **Analisis Padewan & Padangon (`padewan`, `padangon`)**: Memilih hari dengan pelindung dewa berkah tinggi (misalnya *Bathari Sri* untuk menanam padi/kelapa, *Bathara Guru* untuk penolakan bala) dan menjauhi hari dengan apes keras watak Padangon angkuh.
4. **Nagadina (`nagadina`)**: Berputar menghadap rute perjalanan dewa rejeki utama guna keharmonisan hasil hajat.

---

## MODUL 19: HITUNG NAMA AKSARA JAWA (HANACARAKA)

Sistem numerologi nama khas HAMARÉ berlandaskan konversi murni konsonan aksara Jawa kuno (Hanacaraka):

### 1. Klasifikasi Nilai Konsonan Aksara Jawa (Kuno & Modifikasi)
Sistem pembobotan nilai konsonan (`getHitungNamaScore`):
* Konsonan Kelompok 1 (**h, d, p, m**) -> Bobot Nilai `1`
* Konsonan Kelompok 2 (**n, t, dh, g**) -> Bobot Nilai `2`
* Konsonan Kelompok 3 (**c, s, j, b**) -> Bobot Nilai `3`
* Konsonan Kelompok 4 (**r, w, y, th**) -> Bobot Nilai `4`
* Konsonan Kelompok 5 (**k, l, ny, ng**) -> Bobot Nilai `5`

### 2. Aturan Penggandengan Aksara Khusus (Virtual & Eliminasi)
* **Aturan Kra**: Konsonan apa pun yang menggandeng imbuhan kata `'KRA'` (contoh: *Makra*), maka huruf `'KRA'` tersebut dieliminasi mutlak dari hitungan.
* **Aturan Ar**: Semua konsonan yang menggandeng kata `'ar'` di ujung suku kata, maka huruf `'r'`-nya dibuang dari sistem (contoh: *Kar* dibaca sebagai *Ka*).
* **Aturan Ah**: Semua konsonan yang menggandeng akhiran `'ah'`, maka unsur getaran `'h'` dihilangkan (contoh: *Nah* dibaca sebagai *Na*).
* **Aturan Ang**: Getaran sengau `'ang'` di bagian suku kata tengah dieliminasi unsur getarannya untuk keaslian fonetis bahasa Jawa.
* **Aturan Huruf Hidup Lepas (Vocal Awal)**: Apabila nama berawalan dengan vokal murni (`a, e, i, o, u`), sistem menyisipkan huruf virtual `'h'` di depan huruf vokal tersebut (contoh: *Anang* disetarakan menjadi *Hanang*).
* **Sisipan H Vokal Ganda**: Dua vokal tidak sejenis yang berdampingan disisipkan huruf virtual konsonan `'h'` di tengahnya (contoh: *Liam* disetarakan menjadi *Liham*).

### 3. Sisa Pembobotan Akhir (Modulus 5)
Sisa bagi dari total penjumlahan angka nama dibagi bilangan pembagi `5` menghasilkan koordinat nasib:
* Sisa `1`: **SRI** (Gerbang kemakmuran rejeki mengalir lancar terus-menerus).
* Sisa `2`: **LUNGGUH** (Memperoleh kedudukan, namun stagnan pasif kurang berkarya mandiri).
* Sisa `3`: **GENDONG** (Selalu memikul beban kerja berat, diandalkan secara finansial oleh kerabat melampaui batas).
* Sisa `4`: **LARA** (Kerawanan mengidap penyakit fisik atau tekanan batin pikiran).
* Sisa `5` (Sisa `0` dikembalikan ke `5`): **PATI** (Kematian sumber mata pencaharian, kemacetan usaha total).

### 4. Database Sengkalan Otomatis (`SENGKALAN_DB`)
Apabila kata suku nama terdeteksi masuk ke dalam pustaka sengkalan kata sakral Jawa, maka sistem tidak memproses konsonan murni, melainkan langsung memberikan nilai numerik sengkalan baku yang diwakilinya (misal: kata *sirna*, *langit*, *suwung* bernilai `0`; kata *gusti*, *bumi*, *ratu* bernilai `1`; kata *mata*, *mripat*, *kembar* bernilai `2`, dst).

---

## MODUL 20: STATISTIK KUNJUNGAN REAL-TIME

Analisis statistik kunjungan dirawat lewat sinkronisasi mulus database tanpa memberatkan kecepatan render frontend:

### 1. Pelacak ID Tamu Unik (Fingerprinting Tamu)
* Setiap perambah diidentifikasi melalui penginstalan token pelacakan lokal `hamare_visitor_id` yang dibentuk dari kombinasi timestamps presisi dan nilai entropi acak:
  ```typescript
  'v_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 11)
  ```

### 2. Struktur Dokumen Koleksi `visits` Firestore
Setiap pengguna memicu pendaftaran satu baris rekam baru ke koleksi `visits` dengan properti:
* `visitorId`: Kunci unik pencari.
* `monthYear`: Cap bulan berjalan format `YYYY-MM`.
* `createdAt`: Waktu rekam data `serverTimestamp()`.

### 3. Agregasi Real-Time Metrics
Fungsi `useMemo` membongkar baris metadata real-time snapshot menjadi bagan statistik agregasi humanis:
1. **Total Unique Visitors**: Jumlah ID berlainan sepanjang masa.
2. **Current Month Visitors**: Jumlah keunikan ID di bulan berjalan saja.
3. **Recurring Visitors**: Akumulasi ID unik yang tercatat datang minimal `2` kali atau lebih.

---

## MODUL 21: BULAN JAWA & GREGORIAN INTER-OPERABILITY

Penjembatanan dua sistem penanggalan yang berbeda struktur dasar perputaran dirangkum secara rapi:

### 1. Penamaan Bulan Jawa Kosmis (BULAN_JAWI_MASEHI)
Digunakan sebagai penamaan padanan bulan masehi dalam sistem sirkulasi angin tradisional Jawa:
`['Wadana', 'Wijangga', 'Wiyana', 'Widada', 'Widarpa', 'Wilapa', 'Wahana', 'Wanana', 'Wurana', 'Wujana', 'Wujala', 'Warana']`.

### 2. Penyandingan Tanggal
Sistem HAMARÉ menampilkan visualisasi kalender bento multigrid interaktif di mana dalam satu kotak grid sel tanggal Masehi, tertera keterangan tanggal Jawa murni, pasaran, wuku, neptu, hingga sifat harian terkode rapi tanpa memicu lag performa render.

---

## MODUL 22: DEWA HARIAN

Penentuan rujukan dewa penjaga posisi geospasial harian ditentukan secara linear dari keputusan letak `Nagadina`:

* Posisi Naga Hari di **Utara** -> Penjaga Hari: **Bathara Wisnu**
* Posisi Naga Hari di **Timur** -> Penjaga Hari: **Bathari Sri**
* Posisi Naga Hari di **Selatan** -> Penjaga Hari: **Bathara Brahma**
* Posisi Naga Hari di **Barat** -> Penjaga Hari: **Bathara Kala**

---

## MODUL 23: SIKLUS WUKU (30 PEKAN)

Wuku melambangkan jalannya energi 7-harian yang berotasi dalam siklus besar 210 hari (30 Pekan):

### 1. Koordinat Acuan Awal Siklus
* **Hari Awal Wuku Sinta**: Minggu, 9 Februari 2025.
* **Perhitungan Sisa Pekan**:
  ```typescript
  const refSunday = new Date(2025, 1, 9); // Minggu Sinta
  const diffDays = Math.floor((target.getTime() - refSunday.getTime()) / (1000 * 60 * 60 * 24));
  let weeksSince = Math.floor(diffDays / 7);
  let idx = weeksSince % 30;
  if (idx < 0) idx += 30;
  ```

### 2. Daftar 30 Nama Wuku Berurutan
1. Sinta
2. Landep
3. Wukir
4. Kuranthil
5. Tolu
6. Gumbreg
7. Warigalit
8. Warigagung
9. Julungwangi
10. Sungsang
11. Galungan
12. Kuningan
13. Langkir
14. Mandhasiya
15. Julungpujut
16. Pahing (Pahang)
17. Kuruwelut
18. Marakeh
19. Tambir
20. Madhangkungan
21. Maktal
22. Wuye
23. Manahil
24. Prangbakat
25. Bala
26. Wugu
27. Wayang
28. Kulawu
29. Dukut
30. Watugunung

---

## MODUL 24: PADEWAN (SULINGGgIHAN DEWA)

Siklus delapan harian yang berputar berdasarkan pergeseran mingguan (pekan) wuku:

### 1. Struktur Delapan Padewan
1. `Bathari Sri` (Welas Asih - Bagus untuk menanam pangan)
2. `Bathara Indra` (Teliti tapi Angkuh - Bagus belajar ilmu baru)
3. `Bathara Guru` (Suka memberi berkah - Bagus tolak bala)
4. `Bathara Nyamadipati` (Penuh pengertian, lambat - Bagus memulai usaha dagang)
5. `Bathara Rudra` (Berbudi mulia, dermawan - Bagus membuat sumur)
6. `Bathara Brama` (Brangasan, mudah tidak sabar - Bagus membuka lahan sawah)
7. `Bathara Kala` (Suka melanggar aturan - Bagus untuk menyusun aturan disiplin)
8. `Bathari Uma` (Welas asih penderitaan - Bagus membatasi halaman pekarangan)

### 2. Aturan Khusus Wuku Galungan
* Apabila siklus Wuku berada pada Pekan **Galungan** (Index Wuku `10`):
  * Hari Minggu, Senin, dan Selasa **dipaksa melewati aturan mod pekan murni** dan langsung diposisikan di bawah asuhan *Bathara Kala* (Index 6).
  * Hari Rabu di bawah bimbingan *Bathari Uma* (Index 7) guna mencerminkan mitologi ketenangan perebutan sesaji Galungan di tanah Jawa.

---

## MODUL 25: PADANGON (9 SIFAT ELEMENTAL)

Mengatur watak alamiah yang berputar dalam sirkuit 9 harian kosmik:

### 1. Struktur Sembilan Padangon
1. `Dangu` (Watak: Pendiam, keras kepala. Pantangan: Jauhi ketamakan)
2. `Jagur` (Watak: Luwes, kokoh bertenaga. Kerawanan: Iri dengki)
3. `Gigis` (Watak: Berwibawa tinggi, jembar hatinya. Kunci apes: Ketamakan)
4. `Kerangan` (Watak: Cekatan, memegang janji lurus. Kunci apes: Ketamakan)
5. `Nohan` (Watak: Welas asih tinggi. Kunci apes: Ketidakadilan laku)
6. `Wogan` (Watak: Tekun berhemat. Kunci apes: Takabur sombong)
7. `Tulus` (Watak: Banyak karya, tulus ikhlas budi. Kunci apes: Dipengaruhi musuh ketiga)
8. `Wurung` (Watak: Lekas naik darah/brangasan. Kunci apes: Mudah percaya penipu)
9. `Dadi` (Watak: Tidak suka kalah saing. Kunci apes: Melindungi kesalahan kerabat)

### 2. Rumusan Perhitungan Jaringan Padangon
Siklus berjalan berdasarkan hitungan jarak hari dari Minggu Sinta 9 Februari 2025. Terhadap hari sisa di luar siklus utuh 210 hari murni, dikurangi offset 2 hari transmisi transendental, kemudian dihitung berdasarkan sisa pembagian modulus `9`.

---

## MODUL 26: HARI NAAS HARIAN (SADWARA)

Pencatatan rintangan siklus 3-harian dan 6-harian guna keselamatan melangkah penting:

### 1. Klasifikasi Enam Naas (Sadwara-Naas)
1. `Tungle (Daun)`: Watak sanggup ingkar janji. Pantangan menanam tumbuhan daun.
2. `Aryang (Jalma/Manusia)`: Sering dirundung kelupaan. Pantangan membuat hajatan perkawinan atau pindah rumah.
3. `Wurukung (Binatang)`: Hilang konsentrasi. Pantangan memotong kayu pekarangan.
4. `Paningron (Burung)`: Mudah terjangkit rasa sombong. Pantangan meletakkan kurungan burung baru.
5. `Uwas (Ikan)`: Penuh perhitungan bersyarat. Pantangan memelihara bibit ikan kolam.
6. `Mawulu (Biji)`: Rawan terserang penyakit musiman. Pantangan menebar benih semaian padi.

### 2. Rumusan Hitung Naas
Pengecekan selisih hari dari jangkar acuan 27 Januari 2026. Apabila selisih hari habis dibagi angka `3`, maka hari tersebut menyandang label Hari Naas resmi dengan tipe indeks yang dihitung menggunakan pembagian sisa modulus `6` bergeser seimbang.

---

## MODUL 27: PDF ENGINE & EXPORT RULES

Aplikasi HAMARÉ dilengkapi mesin eksportasi dokumen PDF presisi tinggi (`src/components/WetonPDF.tsx` & `src/lib/pdf-service.ts`) dengan batasan ketat pengkodean:

### 1. Prinsip Ekstraksi & Desain Dokumen
* **Dimensi Desain**: Standar A4 potret dengan struktur bento grid mewah yang serasi dengan UI versi digital pengguna.
* **Skala Kualitas Gambar**: Menggunakan setelan resolusi `scale: 2` pada html2canvas guna mencegah huruf kabur ketika PDF dicetak secara fisik oleh pengguna.
* **Kebersihan Konten**: Seluruh tombol aksi interaktif, menu navigasi, dan scrollbar otomatis disembunyikan sebelum tangkapan layar diubah menjadi berkas PDF, menjaga keindahan dokumen bersih.

---

## MODUL 28: NARASI & PENERJEMAHAN WISDOM

Keistimewaan mesin primbon HAMARÉ terletak pada pengalihan narasi watak yang mengusung sastra adiluhung:

### 1. Kosakata Bahasa Agung Jawi
Sistem menerjemahkan kunci watak kalender lewat berkas bahasa Indonesia tepercaya. Mengutamakan pemakaian diksi sastra tinggi seperti *"Ibarat Waspa Kumembeng Jroning Kalbu"* daripada kalimat psikologi modern biasa guna mempertahankan atmosfer kebudayaan yang kental.

### 2. Klasifikasi Peringatan (Disclaimers)
Setiap penjabaran watak weton buruk wajib disertai solusi spiritual preventif yang menenangkan rohani pengguna (misalnya: dengan melakukan laku prihatin berpuasa mutih atau weton, serta memperbanyak sedekah).

---

## MODUL 29: DATABASE & FIREBASE CONFIGURATION

Arsitektur data HAMARÉ dibangun di atas Google Firebase Firestore dengan aturan izin ketat (`firestore.rules`):

### 1. Skema Koleksi Utama
1. **`users`**:
   * ID Dokumen: UID Auth Pengguna.
   * Aturan: Pengguna hanya berhak membaca dan menulis data kepunyaannya sendiri (`request.auth.uid == userId`).
2. **`payments`**:
   * Menyimpan jejak pesanan upgrade akun pelanggan.
   * Aturan: Pengguna terdaftar diizinkan membuat dokumen baru dengan status awal wajib bernilai `pending`. Hanya akun beridentitas khusus Admin tepercaya yang berhak mengubah status pembayaran menjadi sukses.
3. **`history`**:
   * Tempat penyimpanan riwayat konversi hitung weton, jodoh, dan hari baik anggota.
4. **`visits`**:
   * Rekam jejak trafik kunjungan penganalisis performa sistem.

---

## MODUL 30: UI, BRANDING & RHYTHMIC DESIGN

Tampilan visual HAMARÉ bernuansa eksklusif, menyatu erat dengan filosofi kebudayaan spiritual Jawa modern:

### 1. Skema Palet Warna (Pristine Color Scheme)
* **Warna Utama (Primary Ace)**: `#2E7D32` (Warna hijau rimbun khas keraton, melambangkan pertumbuhan rukun, kedamaian alam).
* **Warna Latar (Background)**: Kombinasi putih gading (*Off-white ivory*) yang elegan dipersandingkan dengan abu-abu abu gunung (*Stone/Charcoal grays*) untuk ketajaman baca maksimal.
* **Warna Aksen**: Sentuhan emas kraton `#FBC02D` pada kartu hasil numerologi nama dan jodoh guna memancarkan aura kejayaan spiritual yang menonjol.

### 2. Standar Tipografi Harmonis
* **Display/Headings**: Menggunakan font sans modern berkerapatan rapat (*Inter*) atau aksen mono berselera tinggi (*Space Grotesk*) untuk memperkuat kesan aplikasi modern profesional.
* **Data Teknis/Status**: Menggunakan rujukan aksen tulisan *JetBrains Mono* untuk memelihara kesan presisi bagan kalkulasi digital kuno yang akurat.

---

## MODUL 31: DAFTAR ASUMSI UTAMA SISTEM

Arsitektur aplikasi HAMARÉ bergantung pada asumsi operasional berikut demi menjaga keseimbangan konversi:

1. **Garis Batas Tanggal (Timezone Boundary)**: Seluruh perhitungan kalender mengasumsikan pergantian hari terjadi tepat pukul 00:00 waktu setempat pengguna.
2. **Kesetaraan Sengkalan**: Kata-kata yang tidak tercatat dalam sengkalan kamus hardcoded otomatis dilewatkan ke mesin deteksi fonetis Hanacaraka standar tanpa mengorbankan keamanan sistem.
3. **Persistensi ID Tamu**: Token tamu di perambah diasumsikan abadi sampai pengguna secara sengaja membersihkan riwayat cache browser mereka secara mandiri.
4. **Sistem Keamanan Email Admin**: Secara mutlak mengenali email `geibbymeyrith@gmail.com` sebagai Admin tertinggi pemegang kuasa penuh otentikasi dashboard terverifikasi.

---

## Payment Gateway Migration Decision

Menindaklanjuti audit sistem integrasi sistem pembayaran Mayar dan Firebase Admin SDK pada Juni 2026, HAMARÉ menetapkan keputusan arsitektur migrasi database dan otentikasi sebagai berikut:

### 1. Temuan Masalah & Hambatan Teknis
* **Sandbox AI Studio**: Firestore bawaan aplikasi saat ini menggunakan sandbox AI Studio (`projectId: gen-lang-client-0748393729`, `databaseId: ai-studio-2cccb106-3906-44ad-8017-93b22833bd76`).
* **Kegagalan Admin SDK (`PERMISSION_DENIED`)**: Sisi frontend dapat membaca/menulis karena otentikasi client SDK langsung melalui rules di perambah pengguna. Namun, backend `server.ts` ditolak oleh sistem sandbox karena berjalan di lingkungan kontainer Cloud Run terpisah milik AI Studio tanpa adanya kredensial otentikasi Google bawaan (Application Default Credentials) maupun Service Account JSON.

### 2. Keputusan Arsitektur Strategis
* **Migrasi Database Mandiri**: Sepakat untuk **tidak menggunakan database sandbox AI Studio** untuk tujuan produksi. Seluruh infrastruktur data, autentikasi, log transaksi, kuota data, dan pembayaran akan dimigrasi ke proyek Firebase mandiri milik HAMARÉ sendiri.
* **Otentikasi Kunci Layanan**: Mengamankan otorisasi Firebase Admin SDK di server dengan memuat berkas Service Account JSON dari proyek mandiri tersebut ke dalam variabel rahasia `FIREBASE_SERVICE_ACCOUNT_JSON` di panel Secrets AI Studio. Sisi server akan membaca kredensial ini lewat `cert()` untuk menjamin akses penuh menulis ke koleksi `payments` dan `transactions` secara aman dari callback webhook Mayar.

### 3. Peta Langkah Kerja (Roadmap)
1. Inisiasi Proyek Firebase mandiri HAMARÉ (Aktifkan Auth Email/Password & Cloud Firestore).
2. Download Service Account JSON dari tab Project Settings -> Service Accounts.
3. Ganti konfigurasi client di `firebase-applet-config.json` dengan kredensial proyek baru.
4. Salin isi Service Account JSON ke rahasia `FIREBASE_SERVICE_ACCOUNT_JSON` di AI Studio.
5. Jalankan verifikasi lewat `/api/payment-test` untuk memastikan `firebaseAdmin.connected: true`.
6. Tautkan visualisasi antarmuka `Paywall.tsx` dengan API backend `/api/create-payment` dan integrasikan webhook Mayar secara penuh.

---

*Dokumen ini merupakan panduan pengetahuan teknis dan teologis mutlak aplikasi HAMARÉ. Perubahan pada struktur logika perhitungan penanggalan wajib memperbarui pustaka matematis di dokumen ini terlebih dahulu.*

