import { addDays, differenceInDays, format, isLeapYear, startOfDay } from 'date-fns';

export interface JavaneseDetails {
  masehiDate: Date;
  jawiDate: number;
  jawiMonthName: string;
  masehiDayName: string;
  jawiDayName: string;
  dayLambang: string;
  dayValue: number;
  daySifat: string;
  pasaranName: string;
  pasaranValue: number;
  pasaranDewa: string;
  pasaranSifat: string;
  neptuValue: number;
  tahunSaka: string;
  tahunSakaSifat: string;
  lambang: string;
  lambangSifat: string;
  windu: string;
  winduSifat: string;
  tahunJawi: number;
  tahunJawiSifat: string;
  pranataMangsa: string;
  pranataMangsaSifat: string;
  nagadinaDewa: string;
  nagadinaWarna: string;
  nagadinaArah: string;
  wuku: string;
  wukuSifat: string;
  naas: string;
  naasSifat: string;
  naasPantangan: string;
  gisir: string;
  gisirSifat: string;
  padewan: string;
  padewanSifat: string;
  padewanManfaat: string;
  padangon: string;
  padangonSifat: string;
}

// --- Data Constants ---

export const DAYS_MASEHI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const DAYS_JAWI = ['Radite', 'Soma', 'Anggara', 'Budda', 'Respati', 'Sukra', 'Tumpak'];
export const DAYS_LAMBANG = ['Surya', 'Candra', 'Kartika', 'Bantala', 'Tirta', 'Angin', 'Hakni'];
export const DAYS_VALUE = [5, 4, 3, 7, 8, 6, 9];
export const DAYS_SIFAT: Record<string, string> = {
  'Radite': 'Meneng (diam). Terkait dengan Panca Indera. Terkait sifat orang yang lahir di hari ini: tekun, mandiri, dan berwibawa.',
  'Soma': 'Maju. Terkait dengan Arah. Terkait sifat orang yang lahir di hari ini: selalu berubah, indah, dan selalu mendapatkan simpati.',
  'Anggara': 'Mundur. Terkait dengan Cipta-Rasa-Karsa. Terkait sifat orang yang lahir di hari ini: pemarah, pencemburu, dan luas pergaulannya.',
  'Budda': 'Mangiwa. Terkait dengan Pitutur Piwulang Luhur. Terkait sifat orang yang lahir di hari ini: pendiam, pemomong, dan penyabar.',
  'Respati': 'Manengen, Terkait dengan Hastha Brata, Lakuning Urip. Sanguning Urip Laku Bener Sing Pener. Terkait sifat orang yang lahir di hari ini: sangat menakutkan.',
  'Sukra': 'Munggah. Terkait dengan Sifat Genep Laku Utama. Terkait sifat orang yang lahir di hari ini: energik dan mengagumkan.',
  'Tumpak': 'Tumurun. Terkait dengan Lubang Hidup Manusia. Terkait sifat orang yang lahir di hari ini: membuat orang merasa senang, susah ditebak.'
};

export const PASARAN = [
  { name: 'Pahing-Jenih', value: 9, dewa: 'Dewa Brahma', sifat: 'Pencipta, Jenar, Madep. Terkait sifat orang yang lahir di pasaran ini: Selalu ingin memiliki (barang), kesungguhannya penuh perhitungan untuk mendapatkan untung, suka menolong, mandiri, kuat lapar, banyak musuhnya, kalau tersinggung menakutkan marahnya, suka kebersihan. Sering kena tipu dan kalau kehilangan jarang bisa menemukan kembali.' },
  { name: 'Pon-Abrit', value: 7, dewa: 'Dewa Kala', sifat: 'Penguasa, Palguna, Sare. Terkait sifat orang yang lahir di pasaran ini: Bicaranya banyak diterima orang, suka tinggal di rumah, tidak mau memakan yang bukan kepunyaannya sendiri, suka marah kepada keluarganya, jalan pikirannya sering berbeda dengan pandangan umum. Suka berbantahan, berani kepada atasan. Rejekinya cukup.' },
  { name: 'Wage-Cemeng', value: 4, dewa: 'Dewa Wisnu', sifat: 'Pemelihara, Cemengan, Lenggah. Terkait sifat orang yang lahir di pasaran ini: Menarik tetapi angkuh, setia dan penurut, malas mencari nafkah perlu dibantu orang lain, kaku hati, tidak bisa berpikir panjang, sering gelap pikiran dan mendapat fitnah.' },
  { name: 'Kliwon-Mancawarna', value: 8, dewa: 'Bathara Guru', sifat: 'Pemusnah/ Pelebur, Kasih, Jumeneng. Terkait sifat orang yang lahir di pasaran ini: Pandai bicara dan bergaul, periang, ambisius, urakan, kurang bisa membalas budi, setia pada janji, ceroboh memilih makanan, banyak selamat dan doanya.' },
  { name: 'Legi-Pethak', value: 5, dewa: 'Bathari Sri', sifat: 'Penggerak, Manis, Mungkur. Terkait sifat orang yang lahir di pasaran ini: Bertanggung jawab, murah hati, enak dalam pergaulan, selalu gembira seperti tidak pernah susah, sering kena fitnah, kuat tidak tidur malam hari, berhati-hati namun sering bingung sendiri, bicaranya berisi. Banyak keberuntungan dan kesialannya.' }
];

export const WUKU_DATA: Record<string, string> = {
  'Sinta': 'Dewa Bumi : Bethara Yamadipati. Pohonnya Gendhayakan : Menjadi pelindung atau penolong orang sakit. Burungnya Gagak : Bisa menerima wangsit / ilham. Gedhongnya di depan : Suka memperlihatkan kekayaannya. Amandhi Umbul-umbul : Punya kemuliaan. Wuku Sinta Wulan Karahinan (bulan kesiangan) : Tidak sabaran. Aralnya : Ketika sedang mendapat peningkatan tidak dermawan, maka menyebabkan kejatuhannya. Sedekah / sesaji : Nasi pulen dang-dangan beras senilai zakat fitrah, lauknya pindang kerbau seharga 21 ketheng tidak boleh menawar. Do\'anya : Tolak bilahi. Kala Jaya Bumi : Ada di timur laut menghadap barat daya. Saat wukunya berjalan, selama 7 hari. Sebaiknya tidak bepergian ke arah timur laut. Sinta patine wong ngawig : Matinya orang yang merasa mulia. Wuku Sinta baik untuk mengobati, membuat sarat supaya banyak hujan, mengobati / menawarkan orang terkena pengasihan atau sebaliknya. Tidak baik untuk menanam dan membuka pekarangan.',
  'Landep': 'Dewa Bumi : Bethara Maha Dewa. Pohonnya Gendhayakan : Menjadi pelindung atau penolong orang sakit. Burungnya Atat Kembang : Menjadi pegawainya orang besar, sering mengabdi. Gedhongnya di depan : Suka memperlihatkan kekayaannya. Kakinya berendam di air : Perintahnya lembut di depan panas di belakang. Wuku Landhep Soroting Srengenge. Menerangi hati semua orang. Aralnya : Kejatuhan pohon/ kayu. Sedekah / sesaji : Nasi pulen dang-dangan beras senilai zakat fitrah, iwake menjangan dikolak, digecok, dan dibakar. Do\'anya : Kabul, Selawatnya : 4 ketheng. Kala Jaya Bumi : ada di barat menghadap ke timur. Selama 7 hari jangan mendatangi Kala. Landep mina pringga pati. Wuku Landep baik untuk mengasah pedang, membuat pagar, membuat wisaya ikan. Tidak baik untuk pindah rumah, punya hajat perkawainan, berusaha , dan membuat pintu.',
  'Wukir': 'Dewa Bumi : Bethara Mahayekti. Pohonnya Nagasari : wataknya prihatin. Burungnya Manyar : tidak mau dilebihi. Gedhongnya di depan : Suka memperlihatkan kekayaannya dan dermawan. Wukir asri saka kadohan, yen dicedhaki mbilaheni. Wukir / gunung, (nampak indah dari kejauhan, kalau didekati berbahaya) : tidak diketahui isi hatinya dan berwatak suka memerintah. Aralnya : dianiaya. Sedekah / sesaji : Nasi uduk dang-dangan beras senilai zakat fitrah, lauknya ayam putih dan kuluban (rebusan daun) lima macam. Do\'anya : rajukna, slawatnya : 5 ketheng. Kala Jaya Bumi : ada di tenggara menghadap barat laut. Selama 7 hari menghindari bepergian ke arah tenggara. Wukir sato wana (hewan hutan) lesu : Memiliki pengaruh menundukkan hutan. Wuku Wukir baik untuk mantu, memperbaiki apa saja, berteman tulus. Tidak baik untuk pergi tetirah, mengobati penyakit, memasang tumbal, dan mendirikan rumah.',
  'Kuranthil': 'Dewa Bumi : Bethara Langsur. Pohonnya Inggas : Selalu terburu-buru tetapi hatinya penyabar. Burungnya Slindhitan : tidak suka menganggur. Gedhongnya Terbalik : Boros tidak bisa menyimpan harta. Angiwakake banyu (air) : Suka selingkuh. Membawa umbul-umbul : Bisa hidup senang. Wuku Kurantil Anggara Kasih nuju Wogan : tidak baik hatinya. Aralnya : kalau memanjat. Sedekah / sesaji : Ttumpeng dang-dangan beras senilai zakat fitrah, lauknya ayam blirik dipecel. Do\'anya : pina, slawatnya : 7 ketheng. Kala Jaya Bumi : ada di bawah menghadap ke atas. Saat wukunya berjalan selama 7 hari, sebaiknya menghindari kegiatan ke arah bawah. Kurantil ibarat burung Dhandhang mati kelaparan : kesulitan mendapat nafkah. Wuku Kurantil baik untuk mencari jodoh. Tidak baik untuk menikahkan anak, mengumpulkan orang, menanam, berteman sering bertengkar.',
  'Tolu': 'Dewa Bumi : Bethara Bayu. Burungnya Branjangan : suka membuat perkara. Umbul-umbulnya ada di belakang : Keberuntungannya jatuh belakangan. Gedhongnya didepan : suka memamerkan kekayaannya. Wuku Tolu : angkuh dan susah dilayani kemauannya. Aralnya : kena gigitan taring dan sengat. Sedekah / sesaji : Nasi uduk dang-dangan beras senilai zakat fitrah lauknya ayam dilembaran. Do\'anya : Kabul, slawatnya : 4 ketheng. Kala Jaya Bumi : ada di barat laut menghadap tenggara. Saat wukunya berjalan selama 7 hari, sebaiknya menghindari bepergian kearah barat laut. Tolu pasarean kehing wuku : Tolu kuburan semua wuku (minggu). Wuku Tolu baik untuk mencari nafkah, mengobati orang sakit, menanam pindah tempat, mantu. Tidak baik untuk berkhianat, berjudi, memanen buah-buahan yang pohonnya tinggi (palakirna).',
  'Gumbreg': 'Dewa Bumi : Bethara Cakra. Pohonnya Beringin : menjadi tempat berlindung. Burungnya Ayam Alas : disenangi orang berpangkat. Gedhongnya di sebelah kiri : tulus ikhlas. Kakinya berendam di air : Perintahnya lembut di depan panas di belakang. Gumbreg geter wong tinuku abane : Berwibawa dan berpengaruh, semua perintahnya diikuti bawahan. Aralnya : kalau berada di air. Sedekah / sesaji : Nasi dang-dangan beras senilai zakat fitrah, lauknya ayam barumbun dipindang, kuluban 9 macam. Do\'anya : rajukna, slawatnya : 4 ketheng. Kala Jaya Bumi : ada di selatan. Kalau wukunya berjalan, selama 7 hari hendaknya menghindari bepergian ke arah selatan. Gumbreg patining wreksa : Gumbreg kelemahan bagi yang mengandalkan kekuatan jasmani. Wuku Gumbreg baik untuk merundingkan berbesanan, untuk mencari nafkah mendapat keberuntungan. Tidak baik untuk menanam kebun, mendirikan rumah, memulai berbagai karya dan bepergian.',
  'Warigalit': 'Dewa Bumi : Bethara Asmara. Pohonnya Sulkastri Tanpa Bunga, Buahnya jadi obat: Kesayangan pembesar. Burungnya Kepodang : Wataknya pemarah. Menghadap Candi : hidupnya selalu prihatin. Warigalit tan nganti sandhang pangane Selalu tidak kecukupan sandhang pangannya. Aralnya : sering ikut terserempet perkara. Sedekah / sesaji : Nasi dang-dangan beras senilai zakat fitrah, lauknya ikan rancaban digecok. Do\'anya : tulak bilahi, slawatnya : 4 ketheng. Kala Jaya Bumi : ada di atas menghadap ke bawah. Saat wukunya berjalan selama 7 hari, sebaiknya menghindari kegiatan memanjat. Wuku Warigalit baik untuk berkenalan dan persaudaraan, memuliakan leluhur, mengalirkan air, bepergian mengunjungi sanak kerabat. Tidak baik untuk menyeleweng, bepergian jauh dan berperang.',
  'Warigagung': 'Dewa Bumi : Bethara Maharesi, banyak bicara. Pohonnya Cemara : Angkuh, suka berbuat "tidak baik" (suka menggoda). Burungnya Bethet : bisa mencari nafkah sendiri. Gedhongnya di depan dan di belakang : setengah hemat. Umbul-umbul ada di belakang : Keberuntungannya jatuh belakangan. Warigagung kethuk lindu : Sangat memperhatikan terhadap sandang pangan dirinya (sumber penghidupan). Aralnya : berasal dari sanak saudaranya sendiri. Sedekah / sesaji : Nasi uduk lauknya bebek putih yang dimasak berasa gurih, kuluban (dedaunan direbus) lima macam. Do\'anya : rasul, slawatnya : 4 ketheng. Kala Jaya Bumi : ada di utara menghadap ke selatan. Saat wukunya berjalan selama 7 hari, sebaiknya menghindari bepergian menuju utara. Warigagung ladang mati : tempat yang mati. Wuku Warigagung baik untuk mendirikan rumah, bercocok tanam, berbesanan, berguru ilmu kebatinan. Tidak baik untuk pergi menyamar, pindah tempat, menyiksa binatang piaraan.',
  'Julungwangi': 'Dewa Bumi : Bethara Sambo. Pohonnya Cempaka : banyak disenangi orang. Burungnya Kutilang : banyak bicaranya. Menghadap pasu berisi air : Ikhlas, berbudi baik, tidak suka menyimpan harta. Umbul-umbul berada di depan : sangat disenangi orang berpangkat/besar. Aralnya : diterkam harimau. Sedekah / sesaji : Nasi kebuli lauknya ayam merah dicampurkan nasi. Do\'anya : tulak bilahi, slawatnya : kucing. Kala Jaya Bumi : ada di barat daya menghadap timur laut. Saat wukunya berjalan selama 7 hari, sebaiknya menghindari bepergian menuju ke arah timur laut. Julung wangi banteng lumpuh : banteng adalah simbul sikap yang tangguh, namun lumpuh tidak mampu diberdayakan. Wuku julung wangi baik untuk bepergian lakubrata, bisa mendapatkan wahyu, membuka tanah untuk menanam, untuk menggelar kawruh akan digugu. Tidak baik untuk bepergian jauh, pindah tempat, punya hajat, mendirikan apa saja, bekerja mencari nafkah, mengobati orang sakit.',
  'Sungsang': 'Dewa Bumi : Bethara Gana. Pohonnya Tangan : suka kegiatan tidak mau menganggur. Burungnya Nori : Boros, dermawan, jauh rejekinya, hatinya jahat dan serakah. Sungsang mega mendhung : Wataknya peteng atine (tega, berani). Aralnya : terkena besi. Sedekah / sesaji : Nasi dang-dangan beras senilai zakat fitrah, lauknya ayam dan bebek dimasak apa saja, urap dari sembilan macam daun-daunan. Do\'anya : slamet kabul, slawatnya : 10 ketheng. Kala Jaya Bumi : ada di timur menghadap ke barat. Saat wukunya berjalan selam 7 hari, sebaiknya menghindari bepergian menuju ke timur. Sungsang wurung tiba (datangnya api) : kehadirannya bagaikan datangnya api, menerangi, berwibawa, tetapi juga membuat gerah orang. Wuku Sungsang baik untuk mencari nafkah, pindah tempat, berteman, berkerabat, berbesanan, mbabar kain batik, menanam. Tidak baik untuk memanjat, menebang kayu kebun, pergi jauh, bersenang-senang, beramai-ramai dan berperang.',
  'Galungan': 'Dewa Bumi : Bethara Kamajaya : lambang pecinta dan setia. Pohonnya Tangan : berwatak tidak mau menganggur. Burungnya Bidho : Hatinya keras, berkeinginan tidak baik memiliki barang orang lain. Memangku bokor berisi air : Dermawan tetapi boros. Galungan sering terlena pada keinginan yang mengharu-biru hatinya. Aralnya : suka bertengkar. Sedekah / sesaji : Nasi dang-dangan beras senilai zakat fitrah, lauknya daging kambing atau ayam hitam mulus dipindhang. Do\'anya : klemat pina, slawatnya : 60 ketheng. • Kala Jaya Bumi : ada di timur laut. Saat berjalan wukunya, sebaiknya menghindari bepergian ke arah timur laut. Galungan pring anggagar : bambu kekeringan sehingga tidak bisa berkembang. Wuku Galungan baik untuk tirakat (bertapa), mengunjungi sanak kerabat, berguru kawruh (pengetahuan). Tidak baik untuk menanam bambu, bepergian jauh, mengobati penyakit, menikahkan, mengharap jadi priyayi (orang terhormat), mendirikan rumah.',
  'Kuningan': 'Dewa Bumi : Bethara Indra. Pohonnya Wijayakusuma : Rupawan. Burungnya Urang-urangan : kikir. Kuningan pinuteja : tercerahkan, selamat. Aralnya : diamuk / dikeroyok. Sedekah / sesaji : Sega punar dang-dangan beras senilai zakat fitrah, lauknya rancaban serba digoreng. • Do\'anya : selamat kabul, slawatnya : uang baru 25 ketheng. Kala Jaya Bumi : ada di barat menghadap ke timur. Saat wukunya berjalan selam 7 hari, sebaiknya menghindari bepergian menuju arah barat. Kuningan tata paruthul : Gersang, jangan menanam pohon yang diambil kayunya. Wuku Kuningan baik untuk menjalin persaudaraan, mecari nafkah, menolong orang. Tidak baik untuk menanam, memperindah rumah, menikahkan anak.',
  'Langkir': 'Dewa Bumi : Bethara Kala. Pohonnya Cemara Sol (roboh) dan Pohon Ingas : Auranya panas, sehingga tidak bisa dijadikan tempat berlindung, kurang baik wataknya dan suka berbuat jahat. Burungnya Gemak : Wataknya berani bertindak jahat dan tidak baik. Langkir uripe sarwa oyod (hidupnya serba akar) : Hatinya kaku sehingga menyusahkan diri sendiri. Aralnya : yang dihadapi kecurian dan berkelahi. Sedekah / sesaji : Nasi pulen dang-dangan senilai zakat fitrah, lauknya daging kambing atau ikan air di lembaran, bermacam-macam 9 sayur. Do\'anya : slamet pina. Kala Jaya Bumi : ada di tenggara menghadap ke barat laut. Saat wukunya berjalan selama 7 hari, sebaiknya menghindari bepergian yang menuju arah tenggara. Langkir ana kang wani (ada yang berani) : sering mendapat musuh. Wuku Langkir baik untuk menanam, bepergian, berbesanan, mewarangi senjata, menobati penyakit. Tidak baik untuk berkhianat, berperkara dan bertengkar.',
  'Mandhasiya': 'Dewa Bumi : Bethara Brama. Pohonnya Asam : menjadi tempat berlindung orang susah. Burungnya Platuk Bawang : tenaganya kuat. Gedhongnya di depan tertutup pintunya : Hemat, kalau memberi punya harapan untuk mendapat sanjungan, tinggi hati. Mandhasiya anggara kasih : Bisa memberi perlindungan pada orang lain. Aralnya : kena gigitan taring. Sedekah / sesaji : Nasi ambeng dua, lauknya ayam merah dimasak pindang ditambahi among-among (nasi tumpeng yang diberi kuluban sayur). Do\'anya : slamet, slawatnya : uang baru 40 ketheng. Kala Jaya Bumi : ada di bawah menghadap ke atas. Saat wukunya berjalan , sebaiknya menghindari kegiatan kearah bawah, umpamanya membikin sumur). Mandhasiya mina ninggal banyu : kehilangan lahan hidup. Wuku Mandhasiya baik untuk persahabatan, mengobati penyakit, punya hajat mantu dan lainnya. Tidak baik untuk bepergian, mencari nafkah, membuat sumur dan membuka pekarangan.',
  'Julungpujut': 'Dewa Bumi : Bethara Guritno. Pohonnya Rembuyut : baik penampilannya, sering dicari. Burungnya Emprit Tondhang : Mandiri dalam penghasilan, baik ucapannya. Julung Pujud lengkawa : Berwatak tidak pernah serius (sembrono). Aralnya : ditenung / disantet. Sedekah / sesasji : Nasi tumpeng, lauknya ayam merah, kuluban 9 macam. Do\'anya : qunut, slawatnya : 30 ketheng. Kala Jaya Bumi : ada di barat laut menghadap tenggara. Saat wukunya berjalan selama 7 hari, sebaiknya menghindari bepergian ke arah barat laut. Julung pujud Sapi Gumarang Tumurun : banyak penyakit menular, "Sapi -Gumarang" juga merupakan simbul nuansa kebirahian. Tumurun artinya : nuansa keberahian itu aktif. Mereka yang berwuku Jlg. pujud memiliki nafsu besar. Wuku Jlg. pujud baik untuk mencari nafkah, memelihara hewan, rajakaya (kerbau, sapa, kuda), menanam palakirna (buah-buahan). Tidak baik untuk merencanakan pergi mencari syarat.',
  'Pahang': 'Dewa Bumi : Bethara Tantra. Pohonnya Gendhayakan : menjadi pelindung orang sakit. Burungnya Cocak : Pandai bicara, suka bertempat di perkotaan. Gedhongnya terbuka pintunya : ikhlas dermawan. Memandhi (menyunggi) praja : Ucapannya bernuansa panas. Ngiwakake banyu (meminggirkan ke kiri pasu air) : Kurang baik budi pekertinya. Pahang ora pinuju ing ati (Pahang tidak berkenan di hati) : Mudah tersinggung. Aralnya : dianiaya. Sedekah / sesaji : Nasi gurih dang-dangan beras senilai zakat fitrah, lauknya ayam putih lembaran. Do\'anya : rasul, slawatnya : 40 ketheng. Kala Jaya Bumi : ada di selatan menghadap ke utara. Saat wukunya berjalan selama 7 hari, sebaiknya menghindari bepergian yang menuju ke arah selatan. Pahang ibarat burung terkena jerat : lengah. Wuku Pahang baik untuk mengobati penyakit, menanam apa saja, menikah. Tidak baik untuk bepergian jauh, mencari nafkah, merencanakan dan memperbaiki apa saja.',
  'Kuruwelut': 'Dewa Bumi : Bethara Wisnu. Pohonnya Parijatha : Cekatan tetapi nakal (suka mengganggu orang). Burungnya Sepahan : selalu prihatin. Kuruwelut air jernih di dalam pasu / jembangan : Hatinya dipenuhi perasaan selamat. Aralnya : terkena peluru. Sedekah / sesaji : kambing tujah atau topong. Do\'anya : selamat kabulna, slawatnya : uang senilai satu gram emas. Kala Jaya Bumi : ada di atas menghadap ke bawah. Saat wukunya berjalan selama 7 hari, sebaiknya menghindari memanjat. Kuruwelut ibarat pohon kapas kekeringan : lemah dan sakit-sakitan. Wuku Kuruwelut baik untuk melihat-lihat calon mantu, merencanakan membuat atau memperbaiki rumah. Tidak baik untuk bepergian, memperbaiki apa saja, mengobati penyakit, menanam jujutan (tanaman sejenis jagung).',
  'Marakeh': 'Dewa Bumi : Bethara Surenggana. Pohonnya Trengguli, bunganya tidak bermanfaat, buahnya asri: Tidak bisa disuruh pergi jauh, menjadi pusat perhatian orang ketika dalam pertemuan. Umbul-umbulnya terbalik : cepat mencapai sukses. Gedhongnya disunggi : Suka memamerkan karunia Tuhan yang diperoleh. Marakeh damar agung marapit : daya ingatnya kuat. Aralnya : dianiaya. Sedekah / sesaji : Nasi gurih, luknya ikan di lembaran, sayuran lima macam dan juadah dari membeli. Do\'anya : tulak bilahi, slawatnya : 100 dhuwit. Kala Jaya Bumi : ada di utara menghadap ke selatan. Saat wukunya berjalan selama 7 hari, sebaiknya menghindari bepergian arah ke utara. Marakeh brana sempal (perhiasan tanggal/putus) : tetap berharga. Wuku Marakeh baik untuk menanam padi, pasang tumbal, memperbaiki rumah, membuat pekarangan. Tidak baik untuk bekerja sambilan, berkasih-kasihan dan berpindah tempat.',
  'Tambir': 'Dewa Bumi : Bethara Siwah, kebaikan lahirnya bermuatan pamrih di batin. Pohonnya Upas: Tidak bisa dijadikan tempat berlindung / mengabdi. Burungnya Prenjak : tinggi cita-citanya. Menyandhing Gedhong : suka membual. Tambir Anggara Kasih upas racun : Batinnya tidak selamat. Aralnya : dijahili / dikerjai orang. Sedekah / sesaji : Nasi pulen dan nasi uduk, lauknya pindang bebek dan ayam. Do\'anya : slamet pina, slawatnya : pisau baja dan jarum satu. Kala Jaya Bumi : ada di barat daya menghadap ke timur laut. Saat wukunya berjalan selama 7 hari, sebaiknya menghindari bepergian yang menuju arah ke barat daya. Tambir lesu sarirane : sering kehilangan gairah / semangat. Wuku Tambir baik untuk pergi mencari nafkah, menanam pohon buah-buahan (palakina), menancapkan turus (cabang / ranting pohon yang bisa tumbuh setelah ditancapkan di tanah), berguru ilmu kebatinan dan pergi berperang.',
  'Madhangkungan': 'Dewa Bumi : Bethara Basuki. Pohonnya Plasa : terkenal. Burungnya Pelung : Suka di tempat yang berair, kebaikan dibelakang. Gedhongnya ada di atas : Banyak yang bersimpati, bicaranya halus / sopan, menerima ketentuan Tuhan. Madhangkungan unen-unen kang mbarung (bebunyian yang marak) : periang dan banyak bicara. Aralnya : disalahi di waktu malam. Sedekah / sesaji : Nasi punar, lauknya ayam wiring kuning digoreng dan jenang abang untuk membetulkan wetonnya. Do\'anya : nguwur. Kala Jaya Bumi : ada di timur menghadap ke barat. Saat wukunya berjalan selama 7 hari, sebaiknya menghindari bepergian ke timur. Madhangkungan baya ngurag (buaya mati kelaparan) : sial oleh keadaan. Wuku Mandhangkungan baik untuk menikah, mendirikan rumah, pergi mencari srana (solusi). Tidak baik untuk bertengkar dan berkhianat.',
  'Maktal': 'Dewa Bumi : Bethara Sakri. Pohonnya Nagasari dan burungnya Ayam Alas : Banyak yang bersimpati, ucapannya mememikat, pandai berbakti dan mengabdi. Gedhongnya ditumpangi umbul-umbul : Mendapatkan kekayaan dan kehormatan bersamaan. Maktal pancawara amor angin (tersohor dan terkabarkan) : besar hatinya. Aralnya : berkelahi. Sedekah / sesaji : Nasi pulen dan nasu gurih, lauknya pindang bebek dan ayam lembaran. Do\'anya : memuliakan Nabi dan selamatnya Adam. Kala Jaya Bumi : ada di timur laut menghadap barat daya. Saat wukunya berjalan selama 7 hari, sebaiknya menghindari bepergian yang menuju ke arah timur laut. Maktal ibarat harimau kelaparan yang siap menerkam. Wuku Maktal baik untuk menikahkan, mengundang kerabat untuk suatu keperluan, memperbaiki apa saja dan memuja Tuhan. Tidak baik untuk bepergian, pindah rumah / tempat dan meminjamkan uang.',
  'Wuye': 'Dewa Bumi : Bethara Kuwera. Pohonnya Tal : panjang umurnya. Burungnya Gogik : besar ambisi dan kaku ati. Menyandang keris : Tajam intuisinya. Gedhongnya terbuka pintunya : dermawan dan ikhlas. Kedua kakinya berendam di air : Berwatak memberi keteduhan kepada sesama tajam pandangannya terhadap kebaikan, mudah tersinggung. Aralnya : sanjabaya (bahaya yang datang ketika berkunjung pada kerabat). Sedekah / sesaji : jajan pasar lengkap, juadah dari membeli senilai "satak sawe" namun madu harus dibeli dulu. Do\'anya : tulak bilahi. Kala Jaya Bumi : ada di barat menghadap ke timur. Saat wukunya berjalan selama 7 hari, sebaiknya menghindari bepergian yang menuju arah barat. Wuye masangi manuk nganggo pakan (Wuye menjerat burung dengan umpan pakan) : pandai berstrategi. Wuku Wuye baik untuk menangkap burung, menanam, menjalin persaudaraan, pergi mencari rejeki. Tidak baik pergi jauh dan menipu.',
  'Manahil': 'Dewa Bumi : Bethara Gatra. Pohonnya Tigaron (Tiga Daun) : sedikit bekerja (pemalas). Burungnya Sepahan : baik nafkahnya. Memangku Tombak : tajam intuisi batinnya. Membelakangi air : dingin emosinya. Manahil lintang agung awor mungsuh (bintang agung bersinar bersama musuh) : pencemburu. Aralnya : Kena besi. Sedekah / sesaji : Nasi liwet lauknya ayam dan ikan air, sayur bermacam-macam, sambal gepeng. Do\'anya : ngumur, slawatnya : uang baru senilai 10 ketheng. Kala Jaya Bumi : ada di tenggara menghadap ke barat laut. Saat wukunya berjalan selama 7 hari, sebaiknya menghindari bepergian yang menuju arah tenggara. Manahil wiji kapapas : benih terpangkas. Wuku Manahil baik untuk mencari obat atau syarat srana, membuat bendungan, membuka kuburan, menyelesaikan pertengkaran. Tidak baik untuk menjatuhkan biji, mantu dan mencari sambilan.',
  'Prangbakat': 'Dewa Bumi : Bethara Bisma. Pohonnya Tirisan : Panjang umur dan terjamin baik nafkahnya, sombong. Burungnya Urang-urangan : cekatan. Kaki depannya direndam air : pekertinya lembut di depan dan panas di belakangnya. Prang Bakat Anggara kasih wesi katen purasani (ibarat besi purasani keras) : kaku hatinya. Aralnya : memanjat. Sedekah / sesaji : Nasi dang-dangan beras senilai zakat fitrah, lauknya daging sapi dimasak jajatah dan bumbu manis, urap dari beragam daun-daunan. Do\'anya : slamet pina, slawatnya : sekam / kawul. Kala Jaya Bumi : ada di bawah menghadap ke atas. Saat wukunya berjalan selama 7 hari, sebaiknya menghindari kegiatan turun / menggali tanah. Wuku Prang Bakat baik untuk mencari nafkah sambilan, merawat simpanan pangan, perantara perdagangan, menjatuhkan hukuman. Tidak baik untuk bepergian, menanam tanaman kebun, mencari pekerjaan dan mengobati penyakit.',
  'Bala': 'Dewa Bumi : Bethari Durga. Dipengaruhi watak Durga : tidak memiliki rasa takut dengan semua orang. Pohonnya Cemara : Banyak bicara, suka menyombongkan kedudukan, cenderung berbuat yang tidak baik. Burungnya Ayam Alas : disenangi orang berpangkat. Bala sarwa tiba ing sela mangsa (selalu jatuh di tenggang waktu) : sering membuat keributan. Aralnya : kena santet dan bisa / racun. Sedekah / sesaji : Nasi dang-dangan beras sepitrah, lauknya ayam hitam mulus dipanggang, sayuran 7 macam. Do\'anya : rajukna, slawatnya : uang satu uwang (sauwang). Kala Jaya Bumi : ada di barat laut menghadap ke tenggara. Saat wukunya berjalan, selama 7 hari, sebaiknya menghindari bepergian yang menuju ke arah barat laut. Bala ibaratnya pendeta kelaparan : orang baik yang jauh dari rejeki. Wuku Bala baik untuk mengunjungi teman, menjadi utusan, membantu mempertemukan orang yang sedang berunding. Tidak baik untuk mengajarkan ilmu, mewejangkan ilmu kebatinan dan memperbaiki apapun.',
  'Wugu': 'Dewa Bumi : Singajanma. Pohonnya Wuni : Siapapun yang melihat dan bersimpati, dicemburui dalam hal perolehan rejeki. Burungnya Kepodhang : Gampang tersinggung dan suka menyendiri. Gedhongnya di belakang : kikir. Wugu angkasa uwung-uwung : luas wawasan. Aralnya : terkena bisa. Sedekah / sesaji : nasi dang-dangan beras senilai zakat fitrah, lauknya bebek warna putih 2 ekor di lembaran, jajan pasar segala macam. Do\'anya : selamet kabulna, slawatnya : 10 ketheng. Kala Jaya Bumi : ada di selatan menghadap ke utara. Saat Wukunya berjalan selama 7 hari, sebaiknya menghindari bepergian yang arahnya ke selatan. Wugu kalayu lara mati padha rowang : memiliki setia kawan yang tinggi hingga mau berkorban sampai mati. Wuku Wugu baik untuk memperbaiki rumah, mantu bepergian mencari rejeki, menanam ubi-ubian. Tidak baik untuk membangun pertemanan, berselisih pada belakang harinya dalam mencari nafkah.',
  'Wayang': 'Dewa Bumi Bethari Sri, rupawan dan mukti (berkecukupan ) hidupnya. Pohonnya Cempaka : banyak yang menyukai, berwibawa. Burungnya Ayam Alas : Disenangi orang berpangkat. Menghadap air di jembangan : Tulus ikhlas dan berbakti. Gedhongnya di depan : Suka memaerkan kekayaan dan keberhasilannya. Duduk di air : penyabar. Membelakangi yang serba tajam : gampang di depan sulit di belakang. Wayang pradangga pati : Bisa memberi pencerahan dan punya kelebihan dalam menangkap tanda2 / firasat. Aralnya : dikhianati. Sedekah / sesaji : kambing kendhit masih hidup, juadah suci. Do\'anya : ngumur, ritual do\'anya dihadiri 40 orang. Kala Jaya Bumi : ada di atas menghadap ke bawah. Saat wukunya berjalan selama 7 hari, sebaiknya menghindari kegiatan memanjat. Wayang kelembutan yang mengalahkan berwatak keras. Wuku Wayang baik untuk mencari rejeki, berguru ilmu kebatinan. Tidak baik menjenguk orang sakit, berperang, merencanakan sesuatu.',
  'Kulawu': 'Dewa Bumi : Bethara Sadana. Pohonnya Tal : panjang umurnya. Burungnya Nori : Boros dan rela bukan karena menginginkan sanjungan, esar keinginannya. Kulawu embun jatuh di sendang agung : Serba tepat papan (tempat)nya. Aralnya : kena bisa dan digigit ular. Sedekah / sesaji : Bebek, ayam, burung dimasak bersama-sama, dimasak bebas. Do\'anya : kabulna. Kala Jaya Bumi : ada di utara menghadap ke selatan. Saat wukunya berjalan selama 7 hari, sebaiknya menghindari bepergian yang menuju arah ke utara. Kulawu menikah lagi pun bisa awet wayuh (memadu isteri), ibarat berkumpulnya dengan burung dewata. Wuku Kulawu baik untuk mengobati orang sakit, menikah, wayuh (poligami), berteman. Tidak baik untuk bepergian jauh, pindah tempat dan membuka hutan.',
  'Dukut': 'Dewa Bumi : Bethara Sakri. Pohonnya Pandan : tempatnya terpinggirkan / tersisihkan. Burungnya Ayam Alas : Disenangi orang berpangkat (pembesar). Diapit keris telanjang : Berhati tajam (mudah tersinggung) dan kepinginan. Gedhongnya di belakang : Wataknya narima terhadap nasib dan hati-hati dalam mengeluarkan uang (kumed = mendekati kikir / pelit). Dukut rumput tunggul sari : larangan / sirikan pejabat. Aralnya : dalam peperangan. Sedekah / sesaji : Nasi dang-dangan senilai beras zakat fitrah, lauknya ayam putih mulus dipanggang dan jenang merah. Do\'anya : slamet pina, slawatnya : 3 belah ketheng. Kala Jaya Bumi : ada di barat daya. Saat wukunya berjalan selama 7 hari, sebaiknya menghindari bepergian yang menuju ke arah barat daya. Dukut kitri nata : pilih orang berpangkat dalam bergaul. Wuku Dukut baik untuk memperbaiki rumah, membuka kebun, mencari jodoh, membuat obat dan sesaji. Tidak baik untuk mencari nafkah dan berguru ilmu kebatinan.',
  'Watugunung': 'Dewa Bumi : Bethara Anataboga. Pohonnya Wijaya Kusuma : Menjalani hidup sebagai pendeta. Burungnya Gogik : banyak bicara bernada nasehat. Menghadap candi : suka menjalani lakubrata. Watu gunung gerah uripe (sakit hidupnya) : Orang yang selalu kesusahan akibat ulahnya sendiri. Aralnya : dianiaya. Sedekah / sesaji : kupat dan juadah, makanan bermacam-macam rasa (manis, asin, asam, sepet, pedas, dan pahit). Do\'anya : barik. Kala Jaya Bumi : ada di timur menghadap ke barat. Saat wukunya berjalan selama 7 hari, sebaiknya menghindari bepergian yang menuju ke timur. Watu gunung pepagera njaba patining wreksa narendra (meski dipagari rapat diluar, matinya pohon raja) : Watu gunung kejatuhan para pemimpin. Wuku Watu Gunung baik untuk mencari penyembuhan, menanam, berteman, berbesanan. Tidak baik untuk membuat pagar pekarangan dan menyimpan harta benda.'
};

export const TAHUN_JAWI_SIFAT: Record<number, string> = {
  0: 'Sirna, Ilang, Kosong, Muluk (Terbang), Langit, Dhuwur, Tawang, Sunya, Suwung, Mumbul/ Umbul, Tumenga, Mesat, Akasa, Gegana, Dirgantara, Luhur',
  1: 'Gusti, Bumi, Manusia, Ratu, Candra (Bulan), Surya (Matahari). Tunggal, Eka, Dewa, Kartika, Budi, Jagad, Hyang, Buddha, Srengenge, Lintang, Urip, Praja, Wutuh, Nyata, Dhara (Perut), Bangsa, Aji, Nata (Raja), Wani (Berani), Wiji (Biji), Negara, Buana',
  2: 'Netra (Mata), Asta (Tangan), Suku (Kaki), Miyat, Rupa, Mripat, Apasang, Kembar, Swiwi, Alis, Penganten, Nembah, Nyawang, Nyekel, Mireng, Lumaku, Mabur, Dwi, Kuping, Soca, Paninggal, Sungu, Supit, Ndeleng, Ndulu, Ngrungu, Bekti',
  3: 'Geni (Api), Bahni, Tri, Kaya, Agni, Panas, Estri, Welut, Jurit, Guna, Cacing, Sorot, Murub, Tri, Gebyar',
  4: 'Kerta (Tata), Catur, Pat, Patang, Banyu, Segara, Warih, Karya, Bun, Dadya Gawe, Karti, Jaladri, Jalanidi, Sindu, Samudra, Papat, Nadi, Keblat, Satriya, Sudra, Bening, Brahmana',
  5: 'Pandawa, Angin, Isining (Isi), Panah, Bayu, Iswara, Buta, Alas, Jemparing, Panca, Tumata',
  6: 'Sad, Retu, Rasa, Angga (Tubuh), Anggana (Lebah), Rasa (Legi, Pait, Asin), Lemur, Obah, Wayang, Mangsa, Kayu',
  7: 'Pandita, Sapta, Giri (Gunung), Tinitian, Rsi, Acala, Ardi, Arga, Ajar, Angsa, Biksu, Biksuka, Dwija Giri, Gita, Kaswareng, Kuda, Muni, Nabda, Pitu, Tunggangan, Swara, Guru, Mulang, Sapi, Sinangga',
  8: 'Naga, Gajah, Panggung, Beku, Ula, Dipangga, Buta, Pujangga, Baya, Wasu, Astha, Salira, Manggala',
  9: 'Bolong, Gapura, Trusing, Dwara (Pintu), Wiwara, Sanga, Lubang, Ambuka, Anggangsir, Angleng, Angrong, Arum, Babahan, Bedah, Butul, Dewa, Gatra, Gapura, Ganda, Guwa, Jawata, Kori, Kusuma, Lawang, Menga, Nawa, Hanggatra, Bunga'
};

export const TAHUN_SAKA = ['ALIP', 'EHE', 'JIMAWAL', 'JE', 'DAL', 'BE', 'WAWU', 'JIMAKIR'];
export const TAHUN_SAKA_SIFAT: Record<string, string> = {
  'ALIP': 'Ada-ada (Niat) Melambangkan permulaan. Waktunya manusia mulai menanam niat, ide, atau tekad untuk melakukan sesuatu yang baik.',
  'EHE': 'Tumandang (Bekerja) Melambangkan realisasi. Setelah ada niat di tahun Alip, tahun ini adalah waktunya mulai bergerak dan bertindak.',
  'JIMAWAL': 'Gawe (Pekerjaan) Melambangkan proses. Pekerjaan mulai terlihat bentuknya dan menuntut ketekunan untuk menyelesaikannya.',
  'JE': 'Lelakon (Peristiwa/Nasib) Melambangkan ujian. Dalam proses bekerja, manusia pasti menemui cobaan atau dinamika hidup sebagai ujian mental.',
  'DAL': 'Urip (Hidup) Melambangkan keberadaan. Tahun ini dianggap sakral, sering disebut tahun "Duda". Waktunya merenungi hakikat hidup dan hubungan dengan Sang Pencipta.',
  'BE': 'Bola-bali (Kembali/Konsisten) Melambangkan keteguhan. Mengajarkan manusia untuk tetap konsisten pada kebaikan meskipun sudah melalui berbagai ujian.',
  'WAWU': 'Marang (Arah/Tujuan) Melambangkan fokus. Menjelang akhir siklus, manusia diingatkan untuk kembali fokus pada tujuan akhir hidup agar tidak tersesat.',
  'JIMAKIR': 'Suwung (Kosong/Selesai) Melambangkan akhir dan evaluasi. Fase untuk melepaskan keterikatan duniawi dan mengevaluasi apa yang telah dilakukan selama 8 tahun terakhir.'
};

export const WINDU = ['Adi', 'Kunthara', 'Sangara', 'Sancaya'];
export const WINDU_SIFAT: Record<string, string> = {
  'Adi': 'Artinya ‘Utama’. Memiliki keunggulan dalam segala hal, dan banyak hal-hal baru bermunculan. Memiliki karakter kebangkitan atau kebajikan. Artinya dalam windu ini cocok untuk membangun usaha, mendirikan perusahaan, atau hal-hal yang bersifat membangun untuk kebajikan.',
  'Kunthara': 'Memiliki arti kelakuan. Berarti banyak perilaku baru dan gaya hidup baru. Adalah tahun-tahun yang cocok untuk membina, kerja keras, meningkatkan kualitas hidup, dan sejenisnya.',
  'Sangara': 'Memiliki arti banjir. Adalah windu untuk tahun-tahun yang sebaiknya digunakan untuk menyingkirkan atau menghindari segala hal yang negatif. Artinya, usaha untuk mengeliminasi hal-hal yang negatif justru efektif di windu ini.',
  'Sancaya': 'Memiliki arti kekumpulan. Cocok untuk mempersiapkan diri dengan hal-hal yang diperlukan untuk melakukan pembangunan atau kebangkitan. Windu ini baik untuk melakukan refleksi terhadap apa yang sudah dikerjakan atau diperjuangkan.'
};

export const LAMBANG = ['Langkir', 'Kulawu'];
export const LAMBANG_SIFAT: Record<string, string> = {
  'Langkir': 'Ini mengingatkan manusia akan pentingnya menghargai waktu, memanfaatkannya dengan bijak, dan memahami bahwa segala sesuatu pasti berubah. Pengingat bagi manusia untuk selalu berbuat baik dalam hidup karena waktu akan membawa kita ke akhir kehidupan. Perlu keberanian dalam menghadapi segala tantangan. Menekankan pentingnya introspeksi dan refleksi diri. Senantiasa menyadari dampak perbuatannya dan terus memperbaiki diri. Juga transformasi, yang membawa kehidupan menuju kesadaran yang lebih tinggi.',
  'Kulawu': 'Ini mengingatkan manusia akan pentingnya sifat kukuh, kuat kepribadiannya, menghindari kecenderungan gelap hati, menghindari sifat boros, dan hati-hati dalam mengambil keputusan agar mendapatkan kehidupan dan hhubungan yang lestari.'
};

export const BULAN_JAWI_MASEHI = [
  'Wadana', 'Wijangga', 'Wiyana', 'Widada', 'Widarpa', 'Wilapa', 'Wahana', 'Wanana', 'Wurana', 'Wujana', 'Wujala', 'Warana'
];

export const BULAN_JAWI = [
  { name: 'Sura', days: 30 },
  { name: 'Sapar', days: 29 },
  { name: 'Mulud', days: 30 },
  { name: 'Bakda Mulud', days: 29 },
  { name: 'Jumadil Awal', days: 30 },
  { name: 'Jumadil Akir', days: 29 },
  { name: 'Rejeb', days: 30 },
  { name: 'Ruwah', days: 29 },
  { name: 'Pasa', days: 30 },
  { name: 'Sawal', days: 29 },
  { name: 'Sela', days: 30 },
  { name: 'Besar', days: 29 }
];

export const PRANATA_MANGSA = [
  { name: 'Kartika-Kasa', start: { m: 6, d: 22 }, end: { m: 8, d: 1 }, days: 41, sifat: 'Ibaratnya adalah Batu Permata Terlepas dari Ikatannya. Berada dalam pengaruh Bathara Wisnu. Sifat orang yang lahir di Mangsa ini mempunyai watak welas asih, pendiam dan pemalu tetapi sering dikira angkuh, mudah tersinggung, halus tutur katanya, suka mengkoleksi benda-benda antik, dan mempunyai ambisi yang kuat.' },
  { name: 'Pusa-Karo', start: { m: 8, d: 2 }, end: { m: 8, d: 24 }, days: 23, sifat: 'Ibaratnya Bantolo Rengko. Berada dalam pengaruh Bathara Sambu. Orang yang lahir di Mangsa ini umumnya mempunyai sifat ceroboh, keras hati, kaku, tetapi romantis dan luhur budinya. Jalan pikirannya cemerlang, segala pekerjaan bisa diselesaikan dengan baik.' },
  { name: 'Manggasri-Katelu', start: { m: 8, d: 25 }, end: { m: 9, d: 17 }, days: 24, sifat: 'Ibaratnya Suta Manut Ing Bapa. Berada dalam pengaruh Bathara Rudra, Bathara Kamajaya, dan Bathari Kamaratih. Orang yang lahir di Mangsa ini mempunyai sifat kasih sayang dan adil tidak membedakan satu sama lain, disiplin, jujur, sopan dalam bertutur kata, dan luas pergaulannya.' },
  { name: 'Sitra-Kapat', start: { m: 9, d: 18 }, end: { m: 10, d: 12 }, days: 25, sifat: 'Ibarat Waspa Kumembeng Jroning Kalbu. Berada dalam pengaruh Bathara Wisnu dan Bathara Nyama Dipati. Orang-orang yang lahir di Mangsa ini mempunyai sifat yang sangat baik, suka dimintai tolong oleh orang lain dan pandai bergaul, bahkan mempunyai sifat yang menonjol yaitu menyukai keindahan alam.' },
  { name: 'Manggala-Kalima', start: { m: 10, d: 13 }, end: { m: 11, d: 8 }, days: 27, sifat: 'Ibarat Pancuran Emas Sumawur Ing Jagad. Berada dalam pengaruh Bathara Metri. Orang-orang yang lahir di Mangsa ini mempunayi sifat keberanian, pendiam, dan mudah tersinggung.' },
  { name: 'Naya-Kanem', start: { m: 11, d: 9 }, end: { m: 12, d: 21 }, days: 43, sifat: 'Ibarat Rasa Mulya Kasucian. Berada dalam pengaruh Bathara Guru. Orang-orang yang lahir di Mangsa ini akan mendapatkan kebahagiaan karena kebaikan/ perbuatan baiknya. Mempunyai sifat optimis, selalu rela berkorban.' },
  { name: 'Palguna-Kapitu', start: { m: 12, d: 22 }, end: { m: 2, d: 2 }, days: 43, sifat: 'Ibarat Wisa Kentas Ing Maruta. Berada dalam pengaruh Bathara Endra. Orang-orang kelahiran Mangsa ini jiwanya optimis, dia tidak pernah mempersoalkan masa depan, karena dia percaya apa yang dia kerjakan hari ini menentukan hari esok.' },
  { name: 'Wasika-Kawolu', start: { m: 2, d: 3 }, end: { m: 2, d: 28 }, days: 25, sifat: 'Ibarat Hajrah Jroning Kayun. Berada dalam pengaruh Bathara Brama. Orang-orang yang lahir di Mangsa ini mempunyai pengaruh besar sekali dari kesaktian Bathara Brama. Ia berwibawa dan disenangi masyarakat sekitarnya.' },
  { name: 'Jita-Kasanga', start: { m: 3, d: 1 }, end: { m: 3, d: 25 }, days: 25, sifat: 'Ibarat Wedharing Wacana Mulya. Berada dalam pengaruh Bathara Bayu. Orang-orang yang lahir di Mangsa ini mempunyai sifat dasar kebaikan hati, membela kebenaran, dan bertanggungjawab terhadap apa yang dia perbuat.' },
  { name: 'Srawana-Kasedasa', start: { m: 3, d: 26 }, end: { m: 4, d: 18 }, days: 24, sifat: 'Ibaratnya Gedhong Minep Jroning Kayun. Berada dalam pengaruh Resi Bisma. Orang-orang di Mangsa ini mempunyai sifat teguh hati dan pemberani, tidak mau mengalah, mempunyai jiwa militer yang disiplin dan tegas.' },
  { name: 'Padrawana-Dhesta', start: { m: 4, d: 19 }, end: { m: 5, d: 11 }, days: 23, sifat: 'Ibaratnya Sotya Sinara Wedi. Berada dalam pengaruh Bathara Antaboga. Orang-orang di Mangsa ini mempunyai sifat kalem dalam tindak tanduknya, pandai bergaul dengan siapa saja, sering menunjukkan kedermawanannya.' },
  { name: 'Asuji-Sadda', start: { m: 5, d: 12 }, end: { m: 6, d: 21 }, days: 41, sifat: 'Ibaratnya Tirta Sah Saka Sasana. Berada dalam pengaruh Bathari Sri dan Bathara Sadana. Orang-orang yang lahir di Mangsa ini umumnya memiliki watak kembar, memiliki kecerdasan yang sangat luar biasa.' }
];

export const NAAS = [
  { name: 'Tungle (Daun)', watak: 'Sanggup tapi tidak menepati.', pantangan: 'Menanam tanaman untuk diambil daunnya, seperti tembakau, sirih, sayuran, dan sebagainya.' },
  { name: 'Aryang (Jalma)', watak: 'Sering lupa.', pantangan: 'Mendirikan rumah atau bangunan, membuat hajatan, pindah rumah, membuka usaha, dan mulai menanam tanaman.' },
  { name: 'Wurukung (Binatang)', watak: 'Lengah.', pantangan: 'Menebang hutan atau kayu.' },
  { name: 'Paningron (Burung)', watak: 'Takabur dan atau sombong.', pantangan: 'Membuat kurungan.' },
  { name: 'Uwas (Ikan)', watak: 'Suka pamrih dan ada niat memiliki.', pantangan: 'Memelihara ikan.' },
  { name: 'Mawulu (Biji-bijian)', watak: 'Sering menderita sakit.', pantangan: 'Mulai menanam, menyemai, dan sejenisnya.' }
];

export const GISIR = [
  { name: 'Ringkel', sifat: 'Ringkel' },
  { name: 'Sonya', sifat: 'Sonya' },
  { name: 'Donya', sifat: 'Donya' },
  { name: 'Malihan', sifat: 'Malihan' },
  { name: 'Sonya', sifat: 'Sonya' },
  { name: 'Nyawa', sifat: 'Nyawa' }
];

export const PADEWAN = [
  { name: 'Bathari Sri', sifat: 'Welas Asih.', manfaat: 'Menanam Padi dan Kelapa.' },
  { name: 'Bathara Indra', sifat: 'Teliti tapi Angkuh.', manfaat: 'Mulai belajar semua ilmu.' },
  { name: 'Bathara Guru', sifat: 'Memberi ganjaran tetapi lelemeran.', manfaat: 'Menolak bala.' },
  { name: 'Bathara Nyamadipati', sifat: 'Penuh pengertian tapi malas.', manfaat: 'Memulai usaha dagang.' },
  { name: 'Bathara Rudra', sifat: 'Berbudi, berbojakrama, dan tidak pelit terhadap makanan.', manfaat: 'Membuat sumur atau wagon dan mencari gula kelapa atau aren.' },
  { name: 'Bathara Brama', sifat: 'Brangasan dan tidak sabar.', manfaat: 'Memulai babat alas dan mengerjakan sawah atau ladang.' },
  { name: 'Bathara Kala', sifat: 'Jelek budi, serakah, dan suka berbohong.', manfaat: 'Membuat ketentuan atau aturan.' },
  { name: 'Bathari Uma', sifat: 'Berhati welas melihat orang susah dan jahil.', manfaat: 'Membuat pagar atau batas.' }
];

export const PADANGON = [
  { name: 'Dangu', sifat: 'Wataknya pendiam, bodoh, keras hati. Apesnya adalah kalau serakah.' },
  { name: 'Jangur', sifat: 'Wataknya luwes, kuat, tetapi suka iri hati. Apesnya adalah kalau tidak tahu malu.' },
  { name: 'Gigis', sifat: 'Wataknya kuat dan dapat menerima keadaan, jembar budinya. Apesnya kalau serakah.' },
  { name: 'Kerangan', sifat: 'Wataknya teliti dan tetap pada pendiriannya. Apesnya kalau serakah.' },
  { name: 'Nohan', sifat: 'Wataknya welas asih tetapi malah mendapatkan keadaan yang tidak baik. Apesnya kalau tidak adil, tidak welas asih, dan tidak tetap dalam pendiriannya.' },
  { name: 'Wogan', sifat: 'Wataknya tekun, hemat, dan tetap pada pendiriannya. Apesnya kalau takabur dan sombong.' },
  { name: 'Tulus', sifat: 'Wataknya banyak kemauan, jujur, dan halus caranya. Apesnya kalau banyak kemauan dan itu ditunggangi oleh pihak ketiga.' },
  { name: 'Wurung', sifat: 'Wataknya brangasan (tidak sabar). Apesnya adalah mudah ditipu.' },
  { name: 'Dadi', sifat: 'Wataknya tidak mau disaingi, tidak senang jika ada yang melebihinya. Apesnya adalah kalau memberi perlindungan bagi orang yang bersalah dan menutupi kesalahannya.' }
];

// --- Utility Functions ---

export function getJavaneseDetails(date: Date): JavaneseDetails {
  const targetDate = startOfDay(date);
  
  // Anchor: 23 May 1982 = Sunday (Radite), Pasaran Wage-Cemeng
  const anchorDate = new Date(1982, 4, 23); // May is 4 (0-indexed)
  const daysDiff = differenceInDays(targetDate, anchorDate);

  // 1. Day Masehi & Jawi
  const dayOfWeek = (targetDate.getDay()); // 0 = Sunday
  const masehiDayName = DAYS_MASEHI[dayOfWeek];
  const jawiDayName = DAYS_JAWI[dayOfWeek];
  const dayLambang = DAYS_LAMBANG[dayOfWeek];
  const dayValue = DAYS_VALUE[dayOfWeek];
  const daySifat = `javanese_calendar.days_sifat.${jawiDayName}`;

  // 2. Pasaran
  // 23 May 1982 was Wage (index 2 in [Pahing, Pon, Wage, Kliwon, Legi])
  const pasaranIndex = ((daysDiff % 5) + 5 + 2) % 5;
  const pasaran = PASARAN[pasaranIndex];
  const pasaranName = pasaran.name;
  const pasaranValue = pasaran.value;
  const pasaranDewa = pasaran.dewa;
  const pasaranSifat = `javanese_calendar.pasaran_sifat.${pasaran.name}`;

  // 3. Neptu
  const neptuValue = dayValue + pasaranValue;

  // 4. Wuku
  // Anchor: 25 Jan 2026 was Sunday, start of Wuku Maktal (index 20)
  const wukuAnchor = new Date(2026, 0, 25);
  const wukuDaysDiff = differenceInDays(targetDate, wukuAnchor);
  const weeksDiff = Math.floor(wukuDaysDiff / 7);
  const wukuIndex = ((weeksDiff % 30) + 30 + 20) % 30;
  const wukuNames = [
    'Sinta', 'Landep', 'Wukir', 'Kuranthil', 'Tolu', 'Gumbreg', 'Warigalit', 'Warigagung', 'Julungwangi', 'Sungsang',
    'Galungan', 'Kuningan', 'Langkir', 'Mandhasiya', 'Julungpujut', 'Pahang', 'Kuruwelut', 'Marakeh', 'Tambir', 'Madhangkungan',
    'Maktal', 'Wuye', 'Manahil', 'Prangbakat', 'Bala', 'Wugu', 'Wayang', 'Kulawu', 'Dukut', 'Watugunung'
  ];
  const wuku = wukuNames[wukuIndex];
  const wukuSifat = `javanese_calendar.wuku_sifat.${wuku}`;

  // 5. Tahun Saka, Windu, Lambang
  const year = targetDate.getFullYear();
  // 2026 is Dal (index 4), Sancaya (index 3), Kuwalu (index 1)
  const yearDiff = year - 2026;
  
  const tahunSakaIndex = ((yearDiff % 8) + 8 + 4) % 8;
  const tahunSaka = TAHUN_SAKA[tahunSakaIndex];
  const tahunSakaSifat = `javanese_calendar.tahun_saka_sifat.${tahunSaka}`;

  const winduIndex = ((Math.floor((year - 2021) / 8) % 4) + 4 + 3) % 4;
  const windu = WINDU[winduIndex];
  const winduSifat = `javanese_calendar.windu_sifat.${windu}`;

  const lambangIndex = ((Math.floor((year - 2021) / 8) % 2) + 2 + 1) % 2;
  const lambang = LAMBANG[lambangIndex];
  const lambangSifat = `javanese_calendar.lambang_sifat.${lambang}`;

  // 6. Tahun Jawi
  // (Calculation moved to section 7 for better accuracy)

  // 7. Jawi Date & Month
  // Anchor: 26 Jan 2026 = 7 Ruwah 1959
  // 2026 is Tahun Dal (index 4 in Alip, Ehe, Jimawal, Je, Dal, Be, Wawu, Jimakir)
  // Dal is a leap year (355 days, Besar has 30 days)
  const jawiAnchor = new Date(2026, 0, 26);
  const jawiDaysDiff = differenceInDays(targetDate, jawiAnchor);
  
  // Total days in 8-year cycle (Windu) = 2835
  // Cycle: Alip(354), Ehe(355), Jimawal(354), Je(354), Dal(355), Be(354), Wawu(354), Jimakir(355)
  const yearLengths = [354, 355, 354, 354, 355, 354, 354, 355];
  
  // 26 Jan 2026 is 7 Ruwah 1959. 
  // Ruwah is month 8. Months before: 30, 29, 30, 29, 30, 29, 30 = 207 days.
  // So 7 Ruwah is day 207 + 7 = 214 of the year.
  // Year 1959 is Dal (idx 4).
  // Days from start of Windu to 26 Jan 2026:
  // Alip(354) + Ehe(355) + Jimawal(354) + Je(354) + 214 = 1631 days.
  
  let totalJawiDays = 1631 + jawiDaysDiff;
  const winduCycles = Math.floor(totalJawiDays / 2835);
  totalJawiDays = ((totalJawiDays % 2835) + 2835) % 2835;
  
  let currentYearIdx = 0;
  while (totalJawiDays > yearLengths[currentYearIdx]) {
    totalJawiDays -= yearLengths[currentYearIdx];
    currentYearIdx++;
  }
  if (totalJawiDays === 0) {
    // Edge case for modulo
    totalJawiDays = yearLengths[currentYearIdx];
  }

  const isLeapJawi = yearLengths[currentYearIdx] === 355;
  const months = [...BULAN_JAWI];
  if (isLeapJawi) months[11] = { name: 'Besar', days: 30 };

  let currentMonthIdx = 0;
  while (totalJawiDays > months[currentMonthIdx].days) {
    totalJawiDays -= months[currentMonthIdx].days;
    currentMonthIdx++;
  }
  
  const jawiDate = totalJawiDays;
  const jawiMonthName = months[currentMonthIdx].name;
  
  // Tahun Jawi calculation (approximate but consistent with anchor)
  // 2026 is 1959 Jawi. 
  const tahunJawi = 1959 + (winduCycles * 8) + (currentYearIdx - 4);
  const lastDigit = tahunJawi % 10;
  const tahunJawiSifat = `javanese_calendar.tahun_jawi_sifat.${lastDigit}`;

  // 8. Pranata Mangsa
  let pranataMangsa = 'Unknown';
  let pranataMangsaSifat = '';
  const m = targetDate.getMonth() + 1;
  const d = targetDate.getDate();
  
  for (const pm of PRANATA_MANGSA) {
    const start = pm.start.m * 100 + pm.start.d;
    const end = pm.end.m * 100 + pm.end.d;
    const current = m * 100 + d;
    
    if (start <= end) {
      if (current >= start && current <= end) {
        pranataMangsa = pm.name;
        pranataMangsaSifat = `javanese_calendar.pranata_mangsa_sifat.${pranataMangsa}`;
        break;
      }
    } else {
      // Wraps around year end
      if (current >= start || current <= end) {
        pranataMangsa = pm.name;
        pranataMangsaSifat = `javanese_calendar.pranata_mangsa_sifat.${pranataMangsa}`;
        break;
      }
    }
  }

  // 9. Nagadina
  const nagadinaSisa = (dayValue + pasaranValue) % 4;
  const nagadinaDirections = [
    { arah: 'Utara', warna: 'Hitam', dewa: 'Wisnu' },
    { arah: 'Timur', warna: 'Putih', dewa: 'Sri' },
    { arah: 'Selatan', warna: 'Kuning', dewa: 'Brahma' },
    { arah: 'Barat', warna: 'Merah', dewa: 'Kala' }
  ];
  const nagadina = nagadinaDirections[nagadinaSisa];
  const nagadinaDewa = nagadina.dewa;
  const nagadinaWarna = nagadina.warna;
  const nagadinaArah = `javanese_calendar.nagadina.arah.${nagadina.arah}`;

  // 10. Naas Harian
  // Anchor: 27 Jan 2026 = Wurukung (index 2)
  const naasAnchor = new Date(2026, 0, 27);
  const naasDaysDiff = differenceInDays(targetDate, naasAnchor);
  
  let naas = 'hariBaik.normal';
  let naasSifat = 'hariBaik.normalSifat';
  let naasPantangan = 'hariBaik.noPantangan';

  if (naasDaysDiff % 3 === 0) {
    const naasCycleIdx = ((Math.floor(naasDaysDiff / 3) % 6) + 6 + 2) % 6;
    const naasData = NAAS[naasCycleIdx];
    naas = `HARI NAAS (${naasData.name})`;
    naasSifat = `javanese_calendar.naas.${naasData.name}.watak`;
    naasPantangan = `javanese_calendar.naas.${naasData.name}.pantangan`;
  }

  // 11. Gisir
  // Anchor: 27 Jan 2026 = Malihan (index 3)
  const gisirAnchor = new Date(2026, 0, 27);
  const gisirDaysDiff = differenceInDays(targetDate, gisirAnchor);
  const gisirIdx = ((gisirDaysDiff % 6) + 6 + 3) % 6;
  const gisir = GISIR[gisirIdx].name;
  const gisirSifat = `javanese_calendar.gisir_sifat.${gisir}`;

  // 12. Padewan
  // Starts at Wuku Sinta, Sunday Pahing.
  // Wuku Sinta starts every 210 days.
  // 26 Jan 2026 is Monday Pon (Wuku Maktal).
  // Wuku Sinta starts on 2025-09-07 (Sunday Pahing).
  const padewanAnchor = new Date(2025, 8, 7);
  const padewanDaysDiff = differenceInDays(targetDate, padewanAnchor);
  const padewanWeeksDiff = Math.floor(padewanDaysDiff / 7);
  let padewanIdx = (padewanWeeksDiff % 8 + 8) % 8;
  
  // Aturan Khusus: Wuku Galungan (index 10)
  if (wukuIndex === 10) {
    const day = targetDate.getDay();
    if (day === 0 || day === 1 || day === 2) { // Sun, Mon, Tue
      padewanIdx = 6; // Bathara Kala
    } else if (day === 3) { // Wed
      padewanIdx = 7; // Bathari Uma
    }
  }
  const padewanData = PADEWAN[padewanIdx];
  const padewan = padewanData.name;
  const padewanSifat = `javanese_calendar.padewan_sifat.${padewan}`;
  const padewanManfaat = `javanese_calendar.padewan_manfaat.${padewan}`;

  // 13. Padangon
  // Starts at Wuku Sinta, Sunday Pahing.
  const padangonAnchor = new Date(2025, 8, 7);
  const padangonDaysDiff = differenceInDays(targetDate, padangonAnchor);
  const padangonWeeksDiff = Math.floor(padangonDaysDiff / 7);
  let padangonIdx = (padangonWeeksDiff % 9 + 9) % 9;
  
  // Aturan Khusus: Wuku Sinta (index 0)
  if (wukuIndex === 0) {
    const day = targetDate.getDay();
    if (day >= 0 && day <= 3) { // Sun to Wed
      padangonIdx = 0; // Dangu
    }
  }
  const padangonData = PADANGON[padangonIdx];
  const padangon = padangonData.name;
  const padangonSifat = `javanese_calendar.padangon_sifat.${padangon}`;

  return {
    masehiDate: targetDate,
    jawiDate,
    jawiMonthName,
    masehiDayName,
    jawiDayName,
    dayLambang,
    dayValue,
    daySifat,
    pasaranName,
    pasaranValue,
    pasaranDewa,
    pasaranSifat,
    neptuValue,
    tahunSaka,
    tahunSakaSifat,
    lambang,
    lambangSifat,
    windu,
    winduSifat,
    tahunJawi,
    tahunJawiSifat,
    pranataMangsa,
    pranataMangsaSifat,
    nagadinaDewa,
    nagadinaWarna,
    nagadinaArah,
    wuku,
    wukuSifat,
    naas,
    naasSifat,
    naasPantangan,
    gisir,
    gisirSifat,
    padewan,
    padewanSifat,
    padewanManfaat,
    padangon,
    padangonSifat
  };
}

export function getMangsaFromDate(date: Date): string {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const current = m * 100 + d;

  for (const pm of PRANATA_MANGSA) {
    const start = pm.start.m * 100 + pm.start.d;
    const end = pm.end.m * 100 + pm.end.d;
    
    if (start <= end) {
      if (current >= start && current <= end) return pm.name;
    } else {
      if (current >= start || current <= end) return pm.name;
    }
  }
  return PRANATA_MANGSA[0].name;
}

export function getJodohPinasti(mangsa1: string, mangsa2: string) {
  // Logic based on the table in PDF page 32-34
  const data: Record<string, { jodoh: string; serasi: string[] }> = {
    'Kartika-Kasa': { jodoh: 'Manggala-Kalima', serasi: ['Manggasri-Katelu', 'Palguna-Kapitu', 'Jita-Kasanga'] },
    'Pusa-Karo': { jodoh: 'Srawana-Kasedasa', serasi: ['Naya-Kanem', 'Kartika-Kasa', 'Asuji-Sadda'] },
    'Manggasri-Katelu': { jodoh: 'Palguna-Kapitu', serasi: ['Kartika-Kasa', 'Manggasri-Katelu', 'Manggala-Kalima'] },
    'Sitra-Kapat': { jodoh: 'Wasika-Kawolu', serasi: ['Asuji-Sadda', 'Manggala-Kalima', 'Pusa-Karo'] },
    'Manggala-Kalima': { jodoh: 'Kartika-Kasa', serasi: ['Palguna-Kapitu', 'Manggala-Kalima'] },
    'Naya-Kanem': { jodoh: 'Srawana-Kasedasa', serasi: ['Sitra-Kapat', 'Pusa-Karo', 'Wasika-Kawolu'] },
    'Palguna-Kapitu': { jodoh: 'Manggasri-Katelu', serasi: ['Sitra-Kapat', 'Padrawana-Dhesta', 'Jita-Kasanga'] },
    'Wasika-Kawolu': { jodoh: 'Srawana-Kasedasa', serasi: ['Asuji-Sadda', 'Manggasri-Katelu', 'Wasika-Kawolu'] },
    'Jita-Kasanga': { jodoh: 'Asuji-Sadda', serasi: ['Kartika-Kasa', 'Manggala-Kalima', 'Jita-Kasanga'] },
    'Srawana-Kasedasa': { jodoh: 'Pusa-Karo', serasi: ['Naya-Kanem'] },
    'Padrawana-Dhesta': { jodoh: 'Manggasri-Katelu', serasi: ['Palguna-Kapitu', 'Padrawana-Dhesta'] },
    'Asuji-Sadda': { jodoh: 'Jita-Kasanga', serasi: ['Sitra-Kapat', 'Wasika-Kawolu', 'Asuji-Sadda'] }
  };

  const p1 = data[mangsa1];
  if (!p1) return { status: 'Tidak Diketahui', pesan: '' };

  if (p1.jodoh === mangsa2) {
    return {
      status: 'jodoh.results.pinasti.status',
      pesan: 'jodoh.results.pinasti.pesan'
    };
  } else if (p1.serasi.includes(mangsa2)) {
    return {
      status: 'jodoh.results.serasi.status',
      pesan: 'jodoh.results.serasi.pesan'
    };
  } else {
    return {
      status: 'jodoh.results.kendala.status',
      pesan: 'jodoh.results.kendala.pesan'
    };
  }
}
