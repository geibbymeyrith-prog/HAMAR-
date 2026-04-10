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
        },
        justNow: 'Baru saja',
        manfaat: 'Manfaat',
        jawa: 'Jawa'
      },
      tabs: {
        weton: 'Weton Jawa',
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
        keterangan: 'Keterangan/Pantangan',
        normal: 'Hari Normal',
        normalSifat: 'Hari ini bukan merupakan Hari Naas.',
        noPantangan: 'Tidak ada pantangan khusus.'
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
      },
      javanese_calendar: {
        days_sifat: {
          Radite: 'Meneng (diam). Terkait dengan Panca Indera. Terkait sifat orang yang lahir di hari ini: tekun, mandiri, dan berwibawa.',
          Soma: 'Maju. Terkait dengan Arah. Terkait sifat orang yang lahir di hari ini: selalu berubah, indah, dan selalu mendapatkan simpati.',
          Anggara: 'Mundur. Terkait dengan Cipta-Rasa-Karsa. Terkait sifat orang yang lahir di hari ini: pemarah, pencemburu, dan luas pergaulannya.',
          Budda: 'Mangiwa. Terkait dengan Pitutur Piwulang Luhur. Terkait sifat orang yang lahir di hari ini: pendiam, pemomong, dan penyabar.',
          Respati: 'Manengen, Terkait dengan Hastha Brata, Lakuning Urip. Sanguning Urip Laku Bener Sing Pener. Terkait sifat orang yang lahir di hari ini: sangat menakutkan.',
          Sukra: 'Munggah. Terkait dengan Sifat Genep Laku Utama. Terkait sifat orang yang lahir di hari ini: energik dan mengagumkan.',
          Tumpak: 'Tumurun. Terkait dengan Lubang Hidup Manusia. Terkait sifat orang yang lahir di hari ini: membuat orang merasa senang, susah ditebak.'
        },
        pasaran_sifat: {
          'Pahing-Jenih': 'Pencipta, Jenar, Madep. Terkait sifat orang yang lahir di pasaran ini: Selalu ingin memiliki (barang), kesungguhannya penuh perhitungan untuk mendapatkan untung, suka menolong, mandiri, kuat lapar, banyak musuhnya, kalau tersinggung menakutkan marahnya, suka kebersihan. Sering kena tipu dan kalau kehilangan jarang bisa menemukan kembali.',
          'Pon-Abrit': 'Penguasa, Palguna, Sare. Terkait sifat orang yang lahir di pasaran ini: Bicaranya banyak diterima orang, suka tinggal di rumah, tidak mau memakan yang bukan kepunyaannya sendiri, suka marah kepada keluarganya, jalan pikirannya sering berbeda dengan pandangan umum. Suka berbantahan, berani kepada atasan. Rejekinya cukup.',
          'Wage-Cemeng': 'Pemelihara, Cemengan, Lenggah. Terkait sifat orang yang lahir di pasaran ini: Menarik tetapi angkuh, setia dan penurut, malas mencari nafkah perlu dibantu orang lain, kaku hati, tidak bisa berpikir panjang, sering gelap pikiran dan mendapat fitnah.',
          'Kliwon-Mancawarna': 'Pemusnah/ Pelebur, Kasih, Jumeneng. Terkait sifat orang yang lahir di pasaran ini: Pandai bicara dan bergaul, periang, ambisius, urakan, kurang bisa membalas budi, setia pada janji, ceroboh memilih makanan, banyak selamat dan doanya.',
          'Legi-Pethak': 'Penggerak, Manis, Mungkur. Terkait sifat orang yang lahir di pasaran ini: Bertanggung jawab, murah hati, enak dalam pergaulan, selalu gembira seperti tidak pernah susah, sering kena fitnah, kuat tidak tidur malam hari, berhati-hati namun sering bingung sendiri, bicaranya berisi. Banyak keberuntungan dan kesialannya.'
        },
        nagadina: {
          arah: {
            Utara: 'Menghadap Utara',
            Timur: 'Menghadap Timur',
            Selatan: 'Menghadap Selatan',
            Barat: 'Menghadap Barat'
          }
        },
        naas: {
          Tungle: { watak: 'Sanggup tapi tidak menepati.', pantangan: 'Menanam tanaman untuk diambil daunnya, seperti tembakau, sirih, sayuran, dan sebagainya.' },
          Aryang: { watak: 'Sering lupa.', pantangan: 'Mendirikan rumah atau bangunan, membuat hajatan, pindah rumah, membuka usaha, dan mulai menanam tanaman.' },
          Wurukung: { watak: 'Lengah.', pantangan: 'Menebang hutan atau kayu.' },
          Paningron: { watak: 'Takabur dan atau sombong.', pantangan: 'Membuat kurungan.' },
          Uwas: { watak: 'Suka pamrih dan ada niat memiliki.', pantangan: 'Memelihara ikan.' },
          Mawulu: { watak: 'Sering menderita sakit.', pantangan: 'Mulai menanam, menyemai, dan sejenisnya.' }
        },
        wuku_sifat: {
          Sinta: 'Sifatnya seperti Dewa Yamadipati: tegas, berwibawa, namun bisa menjadi keras.',
          Landep: 'Sifatnya seperti Dewa Mahadewa: cerdas, tajam pemikirannya, dan tangkas.',
          Wukir: 'Sifatnya seperti Dewa Mahayakti: teguh pendiriannya, kuat, dan pelindung.',
          Kuranthil: 'Sifatnya seperti Dewa Langsur: lincah, aktif, dan suka bergerak.',
          Tolu: 'Sifatnya seperti Dewa Bayu: kuat, pemberani, dan pelindung.',
          Gumbreg: 'Sifatnya seperti Dewa Candra: tenang, sejuk, dan disukai banyak orang.',
          Warigalit: 'Sifatnya seperti Dewa Asmara: penuh kasih, menarik, dan romantis.',
          Warigagung: 'Sifatnya seperti Dewa Maharesi: bijaksana, tenang, dan berilmu.',
          Julungwangi: 'Sifatnya seperti Dewa Sambu: harum namanya, terkenal, dan berwibawa.',
          Sungsang: 'Sifatnya seperti Dewa Gana: kuat, penghancur rintangan, dan cerdas.',
          Galungan: 'Sifatnya seperti Dewa Kamajaya: tampan/cantik, setia, dan penuh kasih.',
          Kuningan: 'Sifatnya seperti Dewa Indera: berkuasa, mulia, dan berwibawa.',
          Langkir: 'Sifatnya seperti Dewa Kala: kuat, tegas, namun perlu waspada.',
          Mandhasiya: 'Sifatnya seperti Dewa Brahma: semangat, kreatif, dan berwibawa.',
          Julungpujut: 'Sifatnya seperti Dewa Guritna: pandai bicara, menarik, dan cerdas.',
          Pahang: 'Sifatnya seperti Dewa Tantra: kuat, tekun, dan pekerja keras.',
          Kuruwelut: 'Sifatnya seperti Dewa Wisnu: pelindung, bijaksana, dan tenang.',
          Marakeh: 'Sifatnya seperti Dewa Surenggana: pemberani, kuat, dan tangguh.',
          Tambir: 'Sifatnya seperti Dewa Siwah: tenang, bijaksana, dan spiritual.',
          Madhangkungan: 'Sifatnya seperti Dewa Basuki: membawa keselamatan, tenang, dan damai.',
          Maktal: 'Sifatnya seperti Dewa Sakri: kuat, berwibawa, dan tegas.',
          Wuye: 'Sifatnya seperti Dewa Kuwera: kaya, makmur, dan dermawan.',
          Manahil: 'Sifatnya seperti Dewa Chitragupta: teliti, cerdas, dan adil.',
          Prangbakat: 'Sifatnya seperti Dewa Pranjanjali: lincah, tangkas, dan cerdas.',
          Bala: 'Sifatnya seperti Dewa Durga: kuat, berwibawa, namun perlu waspada.',
          Wugu: 'Sifatnya seperti Dewa Singajalma: kuat, berani, dan pelindung.',
          Wayang: 'Sifatnya seperti Dewa Sri: makmur, subur, dan penuh kasih.',
          Kulawu: 'Sifatnya seperti Dewa Sadana: kaya, makmur, dan beruntung.',
          Dukut: 'Sifatnya seperti Dewa Baruna: luas wawasannya, tenang, dan dalam.',
          Watugunung: 'Sifatnya seperti Dewa Sang Hyang Antaboga: kuat, abadi, dan pelindung.'
        },
        tahun_saka_sifat: {
          Alip: 'Sifatnya seperti air: tenang, sejuk, dan menghidupkan.',
          Ehe: 'Sifatnya seperti api: semangat, kreatif, dan berwibawa.',
          Jimawal: 'Sifatnya seperti angin: lincah, aktif, dan suka bergerak.',
          Je: 'Sifatnya seperti bumi: teguh, kuat, dan pelindung.',
          Dal: 'Sifatnya seperti bintang: terang, terkenal, dan berwibawa.',
          Be: 'Sifatnya seperti bulan: tenang, sejuk, dan disukai banyak orang.',
          Wawu: 'Sifatnya seperti matahari: kuat, berkuasa, dan menerangi.',
          Jimakir: 'Sifatnya seperti gunung: teguh, kuat, dan pelindung.'
        },
        windu_sifat: {
          Sancaya: 'Masa kejayaan, kemakmuran, dan keberhasilan.',
          Adi: 'Masa awal, pertumbuhan, dan harapan baru.',
          Kuntara: 'Masa perjuangan, ketekunan, dan kerja keras.',
          Sengara: 'Masa tantangan, kewaspadaan, dan ketabahan.'
        },
        lambang_sifat: {
          Kuwalu: 'Lambang kesuburan, pertumbuhan, dan kemakmuran.',
          Langgir: 'Lambang kekuatan, ketegasan, dan perlindungan.'
        },
        tahun_jawi_sifat: {
          '0': 'Tahun yang penuh dengan keberuntungan dan kemudahan.',
          '1': 'Tahun yang memerlukan kerja keras dan ketekunan.',
          '2': 'Tahun yang penuh dengan perubahan dan dinamika.',
          '3': 'Tahun yang membawa kedamaian dan ketenangan.',
          '4': 'Tahun yang penuh dengan tantangan dan ujian.',
          '5': 'Tahun yang membawa kemakmuran dan kejayaan.',
          '6': 'Tahun yang memerlukan kewaspadaan dan ketelitian.',
          '7': 'Tahun yang penuh dengan inspirasi dan kreativitas.',
          '8': 'Tahun yang membawa kebahagiaan dan sukacita.',
          '9': 'Tahun yang penuh dengan spiritualitas dan kebijaksanaan.'
        },
        pranata_mangsa_sifat: {
          Kasa: 'Masa terang, langit bersih, daun mulai berguguran.',
          Karo: 'Masa tanah retak, pohon randu mulai berbunga.',
          Katiga: 'Masa air mulai surut, pohon mangga mulai berbunga.',
          Kapat: 'Masa mata air mulai mengalir, burung mulai bersarang.',
          Kalima: 'Masa hujan mulai turun, pohon asam mulai bertunas.',
          Kanem: 'Masa buah-buahan mulai masak, burung mulai bertelur.',
          Kapitu: 'Masa hujan lebat, sungai meluap, musim penyakit.',
          Kawolu: 'Masa padi mulai menghijau, ulat mulai bermunculan.',
          Kasanga: 'Masa padi mulai menguning, burung mulai migrasi.',
          Kasapuluh: 'Masa padi mulai dipanen, burung mulai menetas.',
          Desta: 'Masa udara mulai panas, burung mulai terbang.',
          Sada: 'Masa udara dingin, langit bersih, bintang terlihat jelas.'
        },
        gisir_sifat: {
          Gisir: 'Sifatnya seperti tanah: teguh, kuat, dan pelindung.',
          Nohan: 'Sifatnya seperti air: tenang, sejuk, dan menghidupkan.',
          Wogan: 'Sifatnya seperti angin: lincah, aktif, dan suka bergerak.',
          Malihan: 'Sifatnya seperti api: semangat, kreatif, dan berwibawa.',
          Wurung: 'Sifatnya seperti bintang: terang, terkenal, dan berwibawa.',
          Dadi: 'Sifatnya seperti matahari: kuat, berkuasa, dan menerangi.'
        },
        padewan_sifat: {
          Sri: 'Membawa kemakmuran, kesuburan, dan kasih sayang.',
          Indera: 'Membawa kekuasaan, kemuliaan, dan kewibawaan.',
          Guru: 'Membawa kebijaksanaan, ilmu pengetahuan, dan ketenangan.',
          Yama: 'Membawa ketegasan, keadilan, dan wibawa.',
          Rudra: 'Membawa kekuatan, keberanian, dan semangat.',
          Brahma: 'Membawa kreativitas, penciptaan, dan semangat.',
          Kala: 'Membawa tantangan, kewaspadaan, dan kekuatan.',
          Uma: 'Membawa perlindungan, kasih sayang, dan kedamaian.'
        },
        padewan_manfaat: {
          Sri: 'Baik untuk memulai usaha, menanam, dan pernikahan.',
          Indera: 'Baik untuk urusan kepemimpinan, jabatan, dan kehormatan.',
          Guru: 'Baik untuk belajar, mengajar, dan urusan spiritual.',
          Yama: 'Baik untuk urusan hukum, keadilan, dan ketegasan.',
          Rudra: 'Baik untuk urusan fisik, olahraga, dan keberanian.',
          Brahma: 'Baik untuk urusan seni, kreativitas, dan inovasi.',
          Kala: 'Perlu waspada, baik untuk urusan pertahanan dan perlindungan.',
          Uma: 'Baik untuk urusan keluarga, anak-anak, dan kedamaian.'
        },
        padangon_sifat: {
          Dangu: 'Batu: Teguh, kuat, namun sulit berubah.',
          Jagur: 'Harimau: Kuat, pemberani, namun perlu waspada.',
          Gigis: 'Bumi: Sabar, pelindung, dan menghidupkan.',
          Kerangan: 'Matahari: Terang, berwibawa, dan memberi energi.',
          Nohan: 'Bulan: Tenang, sejuk, dan menarik.',
          Wogan: 'Ulat: Tekun, sabar, namun lambat.',
          Tulus: 'Air: Mengalir, menyesuaikan diri, dan menghidupkan.',
          Wurung: 'Api: Semangat, kreatif, namun bisa menghancurkan.',
          Dadi: 'Kayu: Tumbuh, berkembang, dan memberi manfaat.'
        }
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
        },
        justNow: 'Just now',
        manfaat: 'Benefit',
        jawa: 'Jawa'
      },
      tabs: {
        weton: 'Weton Jawa',
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
        keterangan: 'Notes/Restrictions',
        normal: 'Normal Day',
        normalSifat: 'Today is not an Unlucky Day (Naas).',
        noPantangan: 'No specific restrictions.'
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
      },
      javanese_calendar: {
        days_sifat: {
          Radite: 'Quiet (silent). Related to the Five Senses. Characteristics: diligent, independent, and authoritative.',
          Soma: 'Forward. Related to Direction. Characteristics: ever-changing, beautiful, and always gaining sympathy.',
          Anggara: 'Backward. Related to Creation-Feeling-Will. Characteristics: hot-tempered, jealous, and broad social circle.',
          Budda: 'Leftward. Related to Noble Teachings. Characteristics: quiet, nurturing, and patient.',
          Respati: 'Rightward. Related to Hastha Brata, Way of Life. Characteristics: very intimidating.',
          Sukra: 'Upward. Related to Noble Deeds. Characteristics: energetic and admirable.',
          Tumpak: 'Downward. Related to Human Life Holes. Characteristics: makes people happy, unpredictable.'
        },
        pasaran_sifat: {
          'Pahing-Jenih': 'Creator, Jenar, Facing. Characteristics: Always wants to possess, calculated in seeking profit, helpful, independent, strong hunger tolerance, many enemies, terrifying anger, likes cleanliness. Often deceived and rarely finds lost items.',
          'Pon-Abrit': 'Ruler, Palguna, Sleeping. Characteristics: Speech is widely accepted, likes staying home, doesn\'t take what\'s not theirs, angry with family, unconventional thinking. Likes arguing, brave against superiors. Sufficient fortune.',
          'Wage-Cemeng': 'Maintainer, Cemengan, Sitting. Characteristics: Attractive but arrogant, loyal and obedient, lazy in seeking livelihood, stiff-hearted, short-sighted, often dark-minded and slandered.',
          'Kliwon-Mancawarna': 'Destroyer/Dissolver, Love, Standing. Characteristics: Good at speaking and socializing, cheerful, ambitious, rebellious, less grateful, faithful to promises, careless in food choice, many blessings and prayers.',
          'Legi-Pethak': 'Mover, Sweet, Turning Away. Characteristics: Responsible, generous, good in social circles, always happy, often slandered, strong in staying up late, cautious but often confused, meaningful speech. Much luck and misfortune.'
        },
        nagadina: {
          arah: {
            Utara: 'Facing North',
            Timur: 'Facing East',
            Selatan: 'Facing South',
            Barat: 'Facing West'
          }
        },
        naas: {
          Tungle: { watak: 'Capable but not fulfilling promises.', pantangan: 'Planting crops for leaves, such as tobacco, betel, vegetables, etc.' },
          Aryang: { watak: 'Often forgetful.', pantangan: 'Building a house, holding events, moving house, starting a business, or planting.' },
          Wurukung: { watak: 'Careless.', pantangan: 'Cutting down forests or wood.' },
          Paningron: { watak: 'Arrogant or boastful.', pantangan: 'Making cages.' },
          Uwas: { watak: 'Self-serving and intending to possess.', pantangan: 'Raising fish.' },
          Mawulu: { watak: 'Often suffering from illness.', pantangan: 'Starting to plant, sow, and the like.' }
        },
        wuku_sifat: {
          Sinta: 'Like Yamadipati: firm, authoritative, but can be harsh.',
          Landep: 'Like Mahadewa: intelligent, sharp-minded, and agile.',
          Wukir: 'Like Mahayakti: steadfast, strong, and protective.',
          Kuranthil: 'Like Langsur: lively, active, and likes to move.',
          Tolu: 'Like Bayu: strong, brave, and protective.',
          Gumbreg: 'Like Candra: calm, cool, and well-liked.',
          Warigalit: 'Like Asmara: loving, attractive, and romantic.',
          Warigagung: 'Like Maharesi: wise, calm, and knowledgeable.',
          Julungwangi: 'Like Sambu: famous, well-known, and authoritative.',
          Sungsang: 'Like Gana: strong, obstacle destroyer, and intelligent.',
          Galungan: 'Like Kamajaya: handsome/beautiful, loyal, and loving.',
          Kuningan: 'Like Indera: powerful, noble, and authoritative.',
          Langkir: 'Like Kala: strong, firm, but needs caution.',
          Mandhasiya: 'Like Brahma: spirited, creative, and authoritative.',
          Julungpujut: 'Like Guritna: eloquent, attractive, and intelligent.',
          Pahang: 'Like Tantra: strong, diligent, and hard-working.',
          Kuruwelut: 'Like Wisnu: protective, wise, and calm.',
          Marakeh: 'Like Surenggana: brave, strong, and tough.',
          Tambir: 'Like Siwah: calm, wise, and spiritual.',
          Madhangkungan: 'Like Basuki: brings safety, calm, and peace.',
          Maktal: 'Like Sakri: strong, authoritative, and firm.',
          Wuye: 'Like Kuwera: rich, prosperous, and generous.',
          Manahil: 'Like Chitragupta: meticulous, intelligent, and fair.',
          Prangbakat: 'Like Pranjanjali: lively, agile, and intelligent.',
          Bala: 'Like Durga: strong, authoritative, but needs caution.',
          Wugu: 'Like Singajalma: strong, brave, and protective.',
          Wayang: 'Like Sri: prosperous, fertile, and loving.',
          Kulawu: 'Like Sadana: rich, prosperous, and lucky.',
          Dukut: 'Like Baruna: broad-minded, calm, and deep.',
          Watugunung: 'Like Sang Hyang Antaboga: strong, eternal, and protective.'
        },
        tahun_saka_sifat: {
          Alip: 'Like water: calm, cool, and life-giving.',
          Ehe: 'Like fire: spirited, creative, and authoritative.',
          Jimawal: 'Like wind: lively, active, and likes to move.',
          Je: 'Like earth: steadfast, strong, and protective.',
          Dal: 'Like stars: bright, famous, and authoritative.',
          Be: 'Like the moon: calm, cool, and well-liked.',
          Wawu: 'Like the sun: strong, powerful, and illuminating.',
          Jimakir: 'Like mountains: steadfast, strong, and protective.'
        },
        windu_sifat: {
          Sancaya: 'Era of glory, prosperity, and success.',
          Adi: 'Initial era, growth, and new hope.',
          Kuntara: 'Era of struggle, diligence, and hard work.',
          Sengara: 'Era of challenges, vigilance, and fortitude.'
        },
        lambang_sifat: {
          Kuwalu: 'Symbol of fertility, growth, and prosperity.',
          Langgir: 'Symbol of strength, firmness, and protection.'
        },
        tahun_jawi_sifat: {
          '0': 'A year full of luck and ease.',
          '1': 'A year requiring hard work and diligence.',
          '2': 'A year full of change and dynamics.',
          '3': 'A year bringing peace and tranquility.',
          '4': 'A year full of challenges and trials.',
          '5': 'A year bringing prosperity and glory.',
          '6': 'A year requiring vigilance and meticulousness.',
          '7': 'A year full of inspiration and creativity.',
          '8': 'A year bringing happiness and joy.',
          '9': 'A year full of spirituality and wisdom.'
        },
        pranata_mangsa_sifat: {
          Kasa: 'Bright era, clear sky, leaves begin to fall.',
          Karo: 'Cracked soil era, randu trees begin to bloom.',
          Katiga: 'Water begins to recede era, mango trees begin to bloom.',
          Kapat: 'Springs begin to flow era, birds begin to nest.',
          Kalima: 'Rain begins to fall era, tamarind trees begin to sprout.',
          Kanem: 'Fruits begin to ripen era, birds begin to lay eggs.',
          Kapitu: 'Heavy rain era, overflowing rivers, disease season.',
          Kawolu: 'Rice begins to turn green era, caterpillars begin to appear.',
          Kasanga: 'Rice begins to turn yellow era, birds begin to migrate.',
          Kasapuluh: 'Rice begins to be harvested era, birds begin to hatch.',
          Desta: 'Air begins to get hot era, birds begin to fly.',
          Sada: 'Cold air era, clear sky, stars clearly visible.'
        },
        gisir_sifat: {
          Gisir: 'Like earth: steadfast, strong, and protective.',
          Nohan: 'Like water: calm, cool, and life-giving.',
          Wogan: 'Like wind: lively, active, and likes to move.',
          Malihan: 'Like fire: spirited, creative, and authoritative.',
          Wurung: 'Like stars: bright, famous, and authoritative.',
          Dadi: 'Like the sun: strong, powerful, and illuminating.'
        },
        padewan_sifat: {
          Sri: 'Brings prosperity, fertility, and affection.',
          Indera: 'Brings power, glory, and authority.',
          Guru: 'Brings wisdom, knowledge, and tranquility.',
          Yama: 'Brings firmness, justice, and authority.',
          Rudra: 'Brings strength, courage, and spirit.',
          Brahma: 'Brings creativity, creation, and spirit.',
          Kala: 'Brings challenges, vigilance, and strength.',
          Uma: 'Brings protection, affection, and peace.'
        },
        padewan_manfaat: {
          Sri: 'Good for starting businesses, planting, and marriage.',
          Indera: 'Good for leadership, position, and honor.',
          Guru: 'Good for learning, teaching, and spiritual matters.',
          Yama: 'Good for legal matters, justice, and firmness.',
          Rudra: 'Good for physical matters, sports, and courage.',
          Brahma: 'Good for art, creativity, and innovation.',
          Kala: 'Needs caution, good for defense and protection.',
          Uma: 'Good for family, children, and peace.'
        },
        padangon_sifat: {
          Dangu: 'Stone: Steadfast, strong, but hard to change.',
          Jagur: 'Tiger: Strong, brave, but needs caution.',
          Gigis: 'Earth: Patient, protective, and life-giving.',
          Kerangan: 'Sun: Bright, authoritative, and energizing.',
          Nohan: 'Moon: Calm, cool, and attractive.',
          Wogan: 'Caterpillar: Diligent, patient, but slow.',
          Tulus: 'Water: Flowing, adaptable, and life-giving.',
          Wurung: 'Fire: Spirited, creative, but can be destructive.',
          Dadi: 'Wood: Growing, developing, and beneficial.'
        }
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
        },
        justNow: 'Nembe kemawon',
        manfaat: 'Paedah',
        jawa: 'Jawa'
      },
      tabs: {
        weton: 'Weton Jawa',
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
        keterangan: 'Katrangan/Sirikan',
        normal: 'Dinten Biasa',
        normalSifat: 'Dinten menika sanes Dinten Naas.',
        noPantangan: 'Boten wonten sirikan mirunggan.'
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
      },
      javanese_calendar: {
        days_sifat: {
          Radite: 'Meneng (diam). Gegayutan kaliyan Panca Indera. Watakipun: temen, mandiri, lan wibawa.',
          Soma: 'Maju. Gegayutan kaliyan Kiblat. Watakipun: tansah owah, endah, lan tansah pikantuk simpati.',
          Anggara: 'Mundur. Gegayutan kaliyan Cipta-Rasa-Karsa. Watakipun: gampil duka, cemburu, lan jembar pasrawunganipun.',
          Budda: 'Mangiwa. Gegayutan kaliyan Pitutur Piwulang Luhur. Watakipun: mendel, pemomong, lan sabar.',
          Respati: 'Manengen. Gegayutan kaliyan Hastha Brata, Lakuning Urip. Watakipun: sanget medeni.',
          Sukra: 'Munggah. Gegayutan kaliyan Sipat Genep Laku Utama. Watakipun: energik lan nengsemake.',
          Tumpak: 'Tumurun. Gegayutan kaliyan Bolongan Gesang Manungsa. Watakipun: damel tiyang remen, angèl dipunbedhek.'
        },
        pasaran_sifat: {
          'Pahing-Jenih': 'Pencipta, Jenar, Madep. Watakipun: Tansah kepingin gadhah (barang), temenipun kebak pitungan kagem pados batha, remen tetulung, mandiri, kiyat luwe, kathah mengsahipun, menawi tersinggung medeni dukanipun, remen karesikan. Asring kenging apus lan menawi kecalan awrat pinanggih malih.',
          'Pon-Abrit': 'Panguwasa, Palguna, Sare. Watakipun: Wicantenipun kathah dipuntampi tiyang, remen wonten griya, boten purun nedha ingkang sanes gadhahanipun piyambak, remen duka dhateng kulawarga, pamikiranipun asring benten kaliyan pandangan umum. Remen bantahan, wantun dhateng atasan. Rejekinipun cekap.',
          'Wage-Cemeng': 'Pemelihara, Cemengan, Lenggah. Watakipun: Menarik nanging angkuh, setya lan manut, kesed pados nafkah perlu dipunbantu tiyang sanes, kaku ati, boten saged mikir tebih, asring peteng pikiran lan pikantuk fitnah.',
          'Kliwon-Mancawarna': 'Pemusnah/ Pelebur, Kasih, Jumeneng. Watakipun: Wasis wicanten lan srawung, periang, ambisius, urakan, kirang saged males budi, setya ing janji, sembrono milih dhaharan, kathah slamet lan donganipun.',
          'Legi-Pethak': 'Penggerak, Manis, Mungkur. Watakipun: Tanggung jawab, loman, sekeca ing pasrawungan, tansah gembira kados boten nate susah, asring kenging fitnah, kiyat boten tilem dalu, ngati-ati nanging asring bingung piyambak, wicantenipun mentes. Kathah kabegjan lan kesialanipun.'
        },
        nagadina: {
          arah: {
            Utara: 'Madhep Lor',
            Timur: 'Madhep Wetan',
            Selatan: 'Madhep Kidul',
            Barat: 'Madhep Kulon'
          }
        },
        naas: {
          Tungle: { watak: 'Sanggup nanging boten netepi.', pantangan: 'Nandur tetanduran kagem dipunpendhet godhongipun, kados bako, suruh, janganan, lan sapanunggalipun.' },
          Aryang: { watak: 'Asring supe.', pantangan: 'Ngadegake griya utawa bangunan, damel hajatan, pindah griya, mbukak usaha, lan wiwit nandur.' },
          Wurukung: { watak: 'Sembrono.', pantangan: 'Negor alas utawa kayu.' },
          Paningron: { watak: 'Takabur utawa sombong.', pantangan: 'Damel kurungan.' },
          Uwas: { watak: 'Remen pamrih lan wonten niyat nggadhahi.', pantangan: 'Ngingu iwak.' },
          Mawulu: { watak: 'Asring nandhang sakit.', pantangan: 'Wiwit nandur, nyebar wiji, lan sapanunggalipun.' }
        },
        wuku_sifat: {
          Sinta: 'Kados Dewa Yamadipati: teges, wibawa, nanging saged dados atos.',
          Landep: 'Kados Dewa Mahadewa: wasis, landhep pamikiranipun, lan trengginas.',
          Wukir: 'Kados Dewa Mahayakti: kiyat tekadipun, kiyat, lan ngayomi.',
          Kuranthil: 'Kados Dewa Langsur: lincah, aktif, lan remen mobah.',
          Tolu: 'Kados Dewa Bayu: kiyat, wantun, lan ngayomi.',
          Gumbreg: 'Kados Dewa Candra: ayem, adhem, lan dipunremeni kathah tiyang.',
          Warigalit: 'Kados Dewa Asmara: kebak asih, nengsemake, lan romantis.',
          Warigagung: 'Kados Dewa Maharesi: wicaksana, ayem, lan gadhah elmu.',
          Julungwangi: 'Kados Dewa Sambu: arum namanipun, kondhang, lan wibawa.',
          Sungsang: 'Kados Dewa Gana: kiyat, ngrusak pepalang, lan wasis.',
          Galungan: 'Kados Dewa Kamajaya: bagus/ayu, setya, lan kebak asih.',
          Kuningan: 'Kados Dewa Indera: gadhah panguwasa, mulya, lan wibawa.',
          Langkir: 'Kados Dewa Kala: kiyat, teges, nanging kedah ngati-ati.',
          Mandhasiya: 'Kados Dewa Brahma: semangat, kreatif, lan wibawa.',
          Julungpujut: 'Kados Dewa Guritna: wasis wicanten, nengsemake, lan wasis.',
          Pahang: 'Kados Dewa Tantra: kiyat, temen, lan sregep nyambut damel.',
          Kuruwelut: 'Kados Dewa Wisnu: ngayomi, wicaksana, lan ayem.',
          Marakeh: 'Kados Dewa Surenggana: wantun, kiyat, lan tangguh.',
          Tambir: 'Kados Dewa Siwah: ayem, wicaksana, lan spiritual.',
          Madhangkungan: 'Kados Dewa Basuki: mbeta kawilujengan, ayem, lan tentrem.',
          Maktal: 'Kados Dewa Sakri: kiyat, wibawa, lan teges.',
          Wuye: 'Kados Dewa Kuwera: sugih, makmur, lan loman.',
          Manahil: 'Kados Dewa Chitragupta: titi, wasis, lan adil.',
          Prangbakat: 'Kados Dewa Pranjanjali: lincah, trengginas, lan wasis.',
          Bala: 'Kados Dewa Durga: kiyat, wibawa, nanging kedah ngati-ati.',
          Wugu: 'Kados Dewa Singajalma: kiyat, wantun, lan ngayomi.',
          Wayang: 'Kados Dewa Sri: makmur, subur, lan kebak asih.',
          Kulawu: 'Kados Dewa Sadana: sugih, makmur, lan beja.',
          Dukut: 'Kados Dewa Baruna: jembar wawasanipun, ayem, lan jero.',
          Watugunung: 'Kados Dewa Sang Hyang Antaboga: kiyat, langgeng, lan ngayomi.'
        },
        tahun_saka_sifat: {
          Alip: 'Kados toya: ayem, adhem, lan nggesangake.',
          Ehe: 'Kados latu: semangat, kreatif, lan wibawa.',
          Jimawal: 'Kados angin: lincah, aktif, lan remen mobah.',
          Je: 'Kados bumi: kiyat tekadipun, kiyat, lan ngayomi.',
          Dal: 'Kados lintang: padhang, kondhang, lan wibawa.',
          Be: 'Kados rembulan: ayem, adhem, lan dipunremeni kathah tiyang.',
          Wawu: 'Kados srengenge: kiyat, gadhah panguwasa, lan madhangi.',
          Jimakir: 'Kados redi: kiyat tekadipun, kiyat, lan ngayomi.'
        },
        windu_sifat: {
          Sancaya: 'Masa jaya, makmur, lan kasil.',
          Adi: 'Masa wiwitan, tuwuh, lan pangajab anyar.',
          Kuntara: 'Masa perjuangan, temen, lan sregep nyambut damel.',
          Sengara: 'Masa tantangan, ngati-ati, lan kiyat tekadipun.'
        },
        lambang_sifat: {
          Kuwalu: 'Lambang kesuburan, tuwuh, lan kemakmuran.',
          Langgir: 'Lambang kakuwatan, ketegasan, lan pangayoman.'
        },
        tahun_jawi_sifat: {
          '0': 'Taun ingkang kebak kabegjan lan gampil.',
          '1': 'Taun ingkang mbetahaken temen lan sregep nyambut damel.',
          '2': 'Taun ingkang kebak owah-owahan lan dinamika.',
          '3': 'Taun ingkang mbeta katentreman lan ayem.',
          '4': 'Taun ingkang kebak tantangan lan pacoban.',
          '5': 'Taun ingkang mbeta kemakmuran lan kejayaan.',
          '6': 'Taun ingkang mbetahaken ngati-ati lan titi.',
          '7': 'Taun ingkang kebak inspirasi lan kreativitas.',
          '8': 'Taun ingkang mbeta kabagyan lan remen.',
          '9': 'Taun ingkang kebak spiritualitas lan kawicaksanan.'
        },
        pranata_mangsa_sifat: {
          Kasa: 'Masa padhang, langit resik, godhong wiwit rontok.',
          Karo: 'Masa lemah nela, wit randu wiwit kembang.',
          Katiga: 'Masa toya wiwit sudha, wit pelem wiwit kembang.',
          Kapat: 'Masa sumber wiwit mili, peksi wiwit susuh.',
          Kalima: 'Masa jawah wiwit mandhap, wit asem wiwit semi.',
          Kanem: 'Masa woh-wohan wiwit mateng, peksi wiwit nigan.',
          Kapitu: 'Masa jawah deres, lepen luber, mangsa sakit.',
          Kawolu: 'Masa pantun wiwit ijo, uler wiwit medal.',
          Kasanga: 'Masa pantun wiwit kuning, peksi wiwit migrasi.',
          Kasapuluh: 'Masa pantun wiwit dipunpanen, peksi wiwit netes.',
          Desta: 'Masa hawa wiwit benter, peksi wiwit mabur.',
          Sada: 'Masa hawa adhem, langit resik, lintang katingal cetha.'
        },
        gisir_sifat: {
          Gisir: 'Kados bumi: kiyat tekadipun, kiyat, lan ngayomi.',
          Nohan: 'Kados toya: ayem, adhem, lan nggesangake.',
          Wogan: 'Kados angin: lincah, aktif, lan remen mobah.',
          Malihan: 'Kados latu: semangat, kreatif, lan wibawa.',
          Wurung: 'Kados lintang: padhang, kondhang, lan wibawa.',
          Dadi: 'Kados srengenge: kiyat, gadhah panguwasa, lan madhangi.'
        },
        padewan_sifat: {
          Sri: 'Mbeta kemakmuran, kesuburan, lan asih.',
          Indera: 'Mbeta panguwasa, kamulyan, lan wibawa.',
          Guru: 'Mbeta kawicaksanan, elmu, lan ayem.',
          Yama: 'Mbeta ketegasan, keadilan, lan wibawa.',
          Rudra: 'Mbeta kakuwatan, wantun, lan semangat.',
          Brahma: 'Mbeta kreativitas, penciptaan, lan semangat.',
          Kala: 'Mbeta tantangan, ngati-ati, lan kakuwatan.',
          Uma: 'Mbeta pangayoman, asih, lan katentreman.'
        },
        padewan_manfaat: {
          Sri: 'Sae kagem wiwit usaha, nandur, lan krama.',
          Indera: 'Sae kagem urusan kepemimpinan, jabatan, lan kaurmatan.',
          Guru: 'Sae kagem sinau, mulang, lan urusan spiritual.',
          Yama: 'Sae kagem urusan hukum, keadilan, lan ketegasan.',
          Rudra: 'Sae kagem urusan fisik, olahraga, lan wantun.',
          Brahma: 'Sae kagem urusan seni, kreativitas, lan inovasi.',
          Kala: 'Kedah ngati-ati, sae kagem urusan pertahanan lan pangayoman.',
          Uma: 'Sae kagem urusan kulawarga, lare-lare, lan katentreman.'
        },
        padangon_sifat: {
          Dangu: 'Watu: Kiyat tekadipun, kiyat, nanging awrat owah.',
          Jagur: 'Macan: Kiyat, wantun, nanging kedah ngati-ati.',
          Gigis: 'Bumi: Sabar, ngayomi, lan nggesangake.',
          Kerangan: 'Srengenge: Padhang, wibawa, lan maringi energi.',
          Nohan: 'Rembulan: Ayem, adhem, lan nengsemake.',
          Wogan: 'Uler: Temen, sabar, nanging alon.',
          Tulus: 'Toya: Mili, nyesuaiake dhiri, lan nggesangake.',
          Wurung: 'Latu: Semangat, kreatif, nanging saged ngrusak.',
          Dadi: 'Kayu: Tuwuh, mekar, lan maringi paedah.'
        }
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
