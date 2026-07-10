/**
 * ============================================================================
 * HAMARÉ - Business Configuration
 * ============================================================================
 *
 * Tujuan:
 * Menyimpan seluruh Business Rules (aturan bisnis) yang bersifat configurable
 * agar tidak di-hardcode di berbagai file aplikasi.
 *
 * Semua perubahan aturan bisnis HAMARÉ harus dilakukan melalui file ini,
 * sehingga perubahan di masa depan tidak memerlukan perubahan kode program.
 *
 * Contoh Business Rules:
 * - Harga paket
 * - Jumlah Free Trial
 * - Batas Download PDF Gratis
 * - Diskon (future)
 * - Voucher (future)
 * - Promo (future)
 * - Pajak (future)
 * - Pengaturan fitur lainnya (future)
 *
 * Catatan:
 * - Jangan hardcode nilai bisnis di file lain.
 * - File ini hanya berisi konfigurasi bisnis, bukan state user.
 * - AuthContext tetap bertugas mengelola autentikasi dan status user.
 * ============================================================================
 */

export const BUSINESS_CONFIG = {
  /**
 * Konfigurasi paket HAMARÉ.
 *
 * amounts:
 * Nominal pembayaran dalam Rupiah (IDR).
 *
 * packageIds:
 * Identitas unik paket yang digunakan oleh frontend,
 * backend, webhook, dan database.
 *
 * names:
 * Nama paket yang ditampilkan kepada pengguna.
 */
pricing: {
  amounts: {
    singleUnlock: 15000,
    monthly: 150000,
    yearly: 1150000,
  },

  packageIds: {
    singleUnlock: "15000",
    monthly: "150000",
    yearly: "1150000",
  },

  names: {
    singleUnlock: "1 Unlock (Hanya Hasil Ini)",
    monthly: "Unlimited 30 Hari",
    yearly: "Unlimited 365 Hari",
  },
},

  /**
   * Aturan Free Trial untuk Guest.
   *
   * freeGenerate:
   * Jumlah maksimal generate gratis yang dapat digunakan Guest.
   *
   * freePdf:
   * Jumlah maksimal download PDF gratis yang dapat dilakukan Guest
   * terhadap hasil generate gratis tersebut.
   */
  freeTrial: {
    freeGenerate: 3,
    freePdf: 3,
  },
} as const;
