import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  id: {
    translation: {
      title: 'HAMARÉ',
      subtitle: 'Weton Jawa (Hari Kelahiran) menurut Petung Jawa',
      description: 'Infinite Calendar with Javanesse Wisdom',
      common: {
        login: 'Login',
        logout: 'Logout',
        dashboard: 'Dashboard',
        admin: 'Admin',
        premium: 'Premium',
        back: 'Kembali',
        save: 'Simpan',
        delete: 'Hapus',
        edit: 'Ubah',
        view: 'Lihat',
        loading: 'Memuat...',
        all: 'Semua',
        seeAll: 'Lihat Semua',
        readMore: 'Baca Selengkapnya',
        published: 'Berhasil dipublikasikan!',
        placeholder: {
          day: 'Tgl',
          month: 'Bln',
          year: 'Thn',
          title: 'Masukkan judul...',
          content: 'Tulis isi artikel di sini...'
        }
      },
      tabs: {
        weton: 'Weton Kelahiran',
        jodoh: 'Jodoh Pinasti',
        hariBaik: 'Hari Baik'
      },
      calendar: {
        title: 'Kalender',
        jumpToDate: 'Lompat ke Tanggal',
        go: 'Pergi',
        prev: 'Sebelumnya',
        next: 'Berikutnya',
        days: {
          min: 'Min',
          sen: 'Sen',
          sel: 'Sel',
          rab: 'Rab',
          kam: 'Kam',
          jum: 'Jum',
          sab: 'Sab'
        },
        months: {
          Sura: 'Sura',
          Sapar: 'Sapar',
          Mulud: 'Mulud',
          'Bakda Mulud': 'Bakda Mulud',
          'Jumadil Awal': 'Jumadil Awal',
          'Jumadil Akir': 'Jumadil Akir',
          Rejeb: 'Rejeb',
          Ruwah: 'Ruwah',
          Pasa: 'Pasa',
          Sawal: 'Sawal',
          Sela: 'Sela',
          Besar: 'Besar'
        }
      },
      weton: {
        selectedDate: 'Tanggal Terpilih',
        details: 'Detil Weton Hari Ini',
        calculateTitle: 'Hitung Weton Hari Kelahiran',
        calculateDesc: 'Masukkan tanggal lahir Anda untuk mengetahui weton dan sifat kelahiran.',
        birthDate: 'Tanggal Lahir',
        neptu: 'Neptu',
        masehi: 'Masehi',
        jawi: 'Jawi',
        nagadina: 'Nagadina & Meditasi',
        dewa: 'Dewa',
        warna: 'Warna',
        arah: 'Arah Meditasi',
        labels: {
          jawiDate: 'Tanggal Jawi',
          dayLambang: 'Hari & Lambang',
          pasaranDewa: 'Pasaran & Dewa',
          daySifat: 'Sifat Hari',
          pasaranSifat: 'Sifat Pasaran',
          tahunSaka: 'Tahun Saka',
          windu: 'Windu',
          lambang: 'Lambang Tahun',
          tahunJawi: 'Tahun Jawi',
          pranataMangsa: 'Pranata Mangsa',
          wuku: 'Wuku'
        }
      },
      jodoh: {
        title: 'Cek Jodoh Pinasti',
        desc: 'Hitung kecocokan berdasarkan Mangsa kelahiran Anda dan pasangan.',
        birthDateSelf: 'Tanggal Lahir Anda',
        birthDatePartner: 'Tanggal Lahir Pasangan',
        mangsaSelf: 'Mangsa Anda',
        mangsaPartner: 'Mangsa Pasangan',
        calculate: 'Hitung Kecocokan',
        status: 'Status Pinasti',
        results: {
          pinasti: {
            status: 'Berjodoh (Pinasti)',
            pesan: 'Jika ingin dilanjutkan ke jenjang pernikahan maka silakan pilih hari dan pasaran yang baik. Jika sudah menikah, silakan dapat melakukan puasa weton hari pernikahan setiap 35 hari sekali, jika mampu.'
          },
          serasi: {
            status: 'Serasi',
            pesan: 'Ada kemungkinan kebaikan dan keserasian. Tetap perhatikan hari baik untuk pernikahan.'
          },
          kendala: {
            status: 'Kendala Berjodoh',
            pesan: 'Dalam Petung Jawa, hitungan Jodoh Pinasti adalah tidak untuk dilanggar jika ingin mendapatkan kehidupan pernikahan dan rumah tangga yang harmonis dan bahagia. Namun, jika sudah terlanjur menikah maka dapat melakukan lelaku untuk mengatasinya, salah satunya adalah dengan melakukan Seratan Winadi di setiap weton pernikahannya.'
          }
        }
      },
      hariBaik: {
        title: 'Cek Hari Baik',
        desc: 'Masukkan tanggal rencana acara Anda untuk mengecek kecocokan hari.',
        eventDate: 'Tanggal Acara',
        analysis: 'Analisis Hari Baik',
        naas: 'Hari Naas',
        gisir: 'Gisir Harian',
        padewan: 'Padewan',
        padangon: 'Padangon',
        summary: 'Ringkasan Weton',
        nagadina: 'Nagadina',
        keterangan: 'Keterangan/Pantangan'
      },
      paywall: {
        title: 'Buka Akses Penuh',
        desc: 'Berlangganan untuk melihat hasil perhitungan lengkap.',
        loginBtn: 'Login untuk Berlangganan',
        selectBtn: 'Pilih Paket',
        monthly: 'Bulanan',
        yearly: 'Tahunan',
        save: 'Hemat 2 Bulan!',
        features: {
          fullResult: 'Hasil Lengkap',
          consultation: '1x Konsultasi WA',
          consultationMonthly: '1x Konsultasi WA / bln'
        }
      },
      blog: {
        featured: 'Artikel Pilihan',
        noPosts: 'Belum ada artikel yang dipublikasikan.',
        writeNew: 'Tulis Artikel Baru',
        titleLabel: 'Judul Artikel',
        contentLabel: 'Konten',
        premiumLabel: 'Artikel Premium (Hanya untuk Subscriber)',
        publishBtn: 'Publikasikan'
      },
      dashboard: {
        greeting: 'Halo',
        status: 'Status',
        member: 'Member',
        waConsultation: 'Konsultasi WA',
        available: 'Tersedia',
        history: 'Riwayat Perhitungan',
        noHistory: 'Belum ada riwayat perhitungan.'
      }
    }
  },
  en: {
    translation: {
      title: 'HAMARÉ',
      subtitle: 'Weton Jawa (Birth Date) according to Petung Jawa',
      description: 'Infinite Calendar with Javanesse Wisdom',
      common: {
        login: 'Login',
        logout: 'Logout',
        dashboard: 'Dashboard',
        admin: 'Admin',
        premium: 'Premium',
        back: 'Back',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        loading: 'Loading...',
        all: 'All',
        seeAll: 'See All',
        readMore: 'Read More',
        published: 'Published successfully!',
        placeholder: {
          day: 'Day',
          month: 'Mon',
          year: 'Year',
          title: 'Enter title...',
          content: 'Write article content here...'
        }
      },
      tabs: {
        weton: 'Birth Weton',
        jodoh: 'Jodoh Pinasti',
        hariBaik: 'Auspicious Days'
      },
      calendar: {
        title: 'Calendar',
        jumpToDate: 'Jump to Date',
        go: 'Go',
        prev: 'Prev',
        next: 'Next',
        days: {
          min: 'Sun',
          sen: 'Mon',
          sel: 'Tue',
          rab: 'Wed',
          kam: 'Thu',
          jum: 'Fri',
          sab: 'Sat'
        },
        months: {
          Sura: 'Sura',
          Sapar: 'Sapar',
          Mulud: 'Mulud',
          'Bakda Mulud': 'Bakda Mulud',
          'Jumadil Awal': 'Jumadil Awal',
          'Jumadil Akir': 'Jumadil Akir',
          Rejeb: 'Rejeb',
          Ruwah: 'Ruwah',
          Pasa: 'Pasa',
          Sawal: 'Sawal',
          Sela: 'Sela',
          Besar: 'Besar'
        }
      },
      weton: {
        selectedDate: 'Selected Date',
        details: 'Today\'s Weton Details',
        calculateTitle: 'Calculate Birth Weton',
        calculateDesc: 'Enter your birth date to find out your weton and birth characteristics.',
        birthDate: 'Birth Date',
        neptu: 'Neptu',
        masehi: 'Gregorian',
        jawi: 'Javanese',
        nagadina: 'Nagadina & Meditation',
        dewa: 'Deity',
        warna: 'Color',
        arah: 'Meditation Direction',
        labels: {
          jawiDate: 'Javanese Date',
          dayLambang: 'Day & Symbol',
          pasaranDewa: 'Pasaran & Deity',
          daySifat: 'Day Nature',
          pasaranSifat: 'Pasaran Nature',
          tahunSaka: 'Saka Year',
          windu: 'Windu',
          lambang: 'Year Symbol',
          tahunJawi: 'Javanese Year',
          pranataMangsa: 'Pranata Mangsa',
          wuku: 'Wuku'
        }
      },
      jodoh: {
        title: 'Check Jodoh Pinasti',
        desc: 'Calculate compatibility based on your and your partner\'s birth Mangsa.',
        birthDateSelf: 'Your Birth Date',
        birthDatePartner: 'Partner\'s Birth Date',
        mangsaSelf: 'Your Mangsa',
        mangsaPartner: 'Partner\'s Mangsa',
        calculate: 'Calculate Compatibility',
        status: 'Pinasti Status',
        results: {
          pinasti: {
            status: 'Compatible (Pinasti)',
            pesan: 'If you wish to proceed to marriage, please choose a good day and pasaran. If already married, you can perform a weton fast on your wedding day every 35 days, if able.'
          },
          serasi: {
            status: 'Harmonious',
            pesan: 'There is a possibility of goodness and harmony. Still pay attention to auspicious days for the wedding.'
          },
          kendala: {
            status: 'Compatibility Obstacles',
            pesan: 'In Petung Jawa, the Jodoh Pinasti calculation is not to be violated if you want a harmonious and happy marriage and household. However, if already married, you can perform rituals to overcome it, one of which is by performing Seratan Winadi on every wedding weton.'
          }
        }
      },
      hariBaik: {
        title: 'Check Auspicious Day',
        desc: 'Enter your planned event date to check day compatibility.',
        eventDate: 'Event Date',
        analysis: 'Auspicious Day Analysis',
        naas: 'Unlucky Day (Naas)',
        gisir: 'Daily Gisir',
        padewan: 'Padewan',
        padangon: 'Padangon',
        summary: 'Weton Summary',
        nagadina: 'Nagadina',
        keterangan: 'Notes/Restrictions'
      },
      paywall: {
        title: 'Unlock Full Access',
        desc: 'Subscribe to see full calculation results.',
        loginBtn: 'Login to Subscribe',
        selectBtn: 'Select Plan',
        monthly: 'Monthly',
        yearly: 'Yearly',
        save: 'Save 2 Months!',
        features: {
          fullResult: 'Full Results',
          consultation: '1x WA Consultation',
          consultationMonthly: '1x WA Consultation / mo'
        }
      },
      blog: {
        featured: 'Featured Articles',
        noPosts: 'No articles published yet.',
        writeNew: 'Write New Article',
        titleLabel: 'Article Title',
        contentLabel: 'Content',
        premiumLabel: 'Premium Article (Subscribers Only)',
        publishBtn: 'Publish'
      },
      dashboard: {
        greeting: 'Hello',
        status: 'Status',
        member: 'Member',
        waConsultation: 'WA Consultation',
        available: 'Available',
        history: 'Calculation History',
        noHistory: 'No calculation history yet.'
      }
    }
  },
  jv: {
    translation: {
      title: 'HAMARÉ',
      subtitle: 'Weton Jawa (Dinten Wiyosan) miturut Petung Jawa',
      description: 'Infinite Calendar with Javanesse Wisdom',
      common: {
        login: 'Mlebet',
        logout: 'Metu',
        dashboard: 'Dashboard',
        admin: 'Admin',
        premium: 'Premium',
        back: 'Wangsul',
        save: 'Simpen',
        delete: 'Busak',
        edit: 'Owah',
        view: 'Mirsani',
        loading: 'Ngentosi...',
        all: 'Sedaya',
        seeAll: 'Mirsani Sedaya',
        readMore: 'Waos Salajengipun',
        published: 'Sampun dipunpublikasikaken!',
        placeholder: {
          day: 'Tgl',
          month: 'Sasi',
          year: 'Taun',
          title: 'Lebokake judul...',
          content: 'Tulis isi artikel ing kene...'
        }
      },
      tabs: {
        weton: 'Weton Wiyosan',
        jodoh: 'Jodoh Pinasti',
        hariBaik: 'Dinten Sae'
      },
      calendar: {
        title: 'Almanak',
        jumpToDate: 'Mlumpat dhateng Tanggal',
        go: 'Lajeng',
        prev: 'Saderengipun',
        next: 'Salajengipun',
        days: {
          min: 'Ahad',
          sen: 'Sen',
          sel: 'Sel',
          rab: 'Reb',
          kam: 'Kem',
          jum: 'Jum',
          sab: 'Set'
        },
        months: {
          Sura: 'Sura',
          Sapar: 'Sapar',
          Mulud: 'Mulud',
          'Bakda Mulud': 'Bakda Mulud',
          'Jumadil Awal': 'Jumadil Awal',
          'Jumadil Akir': 'Jumadil Akir',
          Rejeb: 'Rejeb',
          Ruwah: 'Ruwah',
          Pasa: 'Pasa',
          Sawal: 'Sawal',
          Sela: 'Sela',
          Besar: 'Besar'
        }
      },
      weton: {
        selectedDate: 'Tanggal Pinilih',
        details: 'Detil Weton Dinten Menika',
        calculateTitle: 'Etung Weton Dinten Wiyosan',
        calculateDesc: 'Lebokake tanggal wiyosan Panjenengan kagem mangertosi weton lan sipat wiyosan.',
        birthDate: 'Tanggal Wiyosan',
        neptu: 'Neptu',
        masehi: 'Masehi',
        jawi: 'Jawi',
        nagadina: 'Nagadina & Semedi',
        dewa: 'Dewa',
        warna: 'Warni',
        arah: 'Kiblat Semedi',
        labels: {
          jawiDate: 'Tanggal Jawi',
          dayLambang: 'Dinten & Lambang',
          pasaranDewa: 'Pasaran & Dewa',
          daySifat: 'Sipat Dinten',
          pasaranSifat: 'Sipat Pasaran',
          tahunSaka: 'Taun Saka',
          windu: 'Windu',
          lambang: 'Lambang Taun',
          tahunJawi: 'Taun Jawi',
          pranataMangsa: 'Pranata Mangsa',
          wuku: 'Wuku'
        }
      },
      jodoh: {
        title: 'Cek Jodoh Pinasti',
        desc: 'Ngetung kacocokan adhedhasar Mangsa wiyosan Panjenengan lan pasangan.',
        birthDateSelf: 'Tanggal Wiyosan Panjenengan',
        birthDatePartner: 'Tanggal Wiyosan Pasangan',
        mangsaSelf: 'Mangsa Panjenengan',
        mangsaPartner: 'Mangsa Pasangan',
        calculate: 'Etung Kacocokan',
        status: 'Status Pinasti',
        results: {
          pinasti: {
            status: 'Berjodoh (Pinasti)',
            pesan: 'Menawi kersa dipunlajengaken dhateng jenjang bebrayan, sumangga milih dinten lan pasaran ingkang sae. Menawi sampun krama, saged nindakaken pasa weton dinten krama saben 35 dinten sepisan, menawi kiyat.'
          },
          serasi: {
            status: 'Serasi',
            pesan: 'Wonten kamungkinan kasaenan lan kaserasian. Tetep nggatosaken dinten sae kagem krama.'
          },
          kendala: {
            status: 'Kendala Berjodoh',
            pesan: 'Ing Petung Jawa, etungan Jodoh Pinasti menika boten kagem dipunlanggar menawi kersa pikantuk gesang bebrayan ingkang harmonis lan bagya. Nanging, menawi sampun kelajeng krama, saged nindakaken lelaku kagem nanggulangi, salah satunggalipun kanthi nindakaken Seratan Winadi ing saben weton kramanipun.'
          }
        }
      },
      hariBaik: {
        title: 'Cek Dinten Sae',
        desc: 'Lebokake tanggal rencana adicara Panjenengan kagem ngecek kacocokan dinten.',
        eventDate: 'Tanggal Adicara',
        analysis: 'Analisis Dinten Sae',
        naas: 'Dinten Naas',
        gisir: 'Gisir Padintenan',
        padewan: 'Padewan',
        padangon: 'Padangon',
        summary: 'Ringkesan Weton',
        nagadina: 'Nagadina',
        keterangan: 'Katrangan/Sirikan'
      },
      paywall: {
        title: 'Mbikak Akses Jangkep',
        desc: 'Langganan kagem mirsani asil etungan jangkep.',
        loginBtn: 'Mlebet kagem Langganan',
        selectBtn: 'Pilih Paket',
        monthly: 'Saben Sasi',
        yearly: 'Saben Taun',
        save: 'Irit 2 Sasi!',
        features: {
          fullResult: 'Asil Jangkep',
          consultation: '1x Konsultasi WA',
          consultationMonthly: '1x Konsultasi WA / sasi'
        }
      },
      blog: {
        featured: 'Artikel Pilihan',
        noPosts: 'Dereng wonten artikel ingkang dipunpublikasikaken.',
        writeNew: 'Serat Artikel Anyar',
        titleLabel: 'Judul Artikel',
        contentLabel: 'Konten',
        premiumLabel: 'Artikel Premium (Khusus Subscriber)',
        publishBtn: 'Publikasikaken'
      },
      dashboard: {
        greeting: 'Sugeng',
        status: 'Status',
        member: 'Member',
        waConsultation: 'Konsultasi WA',
        available: 'Wonten',
        history: 'Riwayat Etungan',
        noHistory: 'Dereng wonten riwayat etungan.'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'id',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
