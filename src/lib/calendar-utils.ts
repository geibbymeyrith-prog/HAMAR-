export const getJavaneseMonthName = (masehiMonth: number) => {
  const months = [
    'Wadana', 'Wijangga', 'Wiyana', 'Widada', 'Widarpa', 'Wilapa',
    'Wahana', 'Wanana', 'Wurana', 'Wujana', 'Wujala', 'Warana'
  ];
  return months[masehiMonth];
};

export const getJavaneseYearDetails = (masehiYear: number) => {
  const sequence = ['Alip', 'Ehe', 'Jimawal', 'Je', 'Dal', 'Be', 'Wawu', 'Jimakir'];
  const refMasehi = 2025;
  const refJavaYear = 1958;
  const refIndex = 3; // 'Je'
  
  const diff = masehiYear - refMasehi;
  const javaYear = refJavaYear + diff;
  let javaIndex = (refIndex + diff) % 8;
  if (javaIndex < 0) javaIndex += 8;
  
  return { year: javaYear, name: sequence[javaIndex] };
};

export const JAVA_MONTHS = [
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

export const PM_ORDERED = [
  { name: 'Jita - Kasanga', days: 25 },
  { name: 'Srawana - Kasedasa', days: 24 },
  { name: 'Destha - Pradawana', days: 23 },
  { name: 'Sadda - Asuji', days: 41 },
  { name: 'Kasa - Kartika', days: 41 },
  { name: 'Pusa - Karo', days: 23 },
  { name: 'Katelu - Manggasri', days: 24 },
  { name: 'Kapat - Sitra', days: 25 },
  { name: 'Kalima - Manggala', days: 27 },
  { name: 'Kanem - Naya', days: 43 },
  { name: 'Palguna - Kapitu', days: 43 },
  { name: 'Wasika - Kawolu', days: 25 }
];

const totalYearDaysJava = 354;
const refDateJava = new Date(2025, 4, 1); // 1 Mei 2025
const refDayIdxJava = 298; // Day 3 Sela in 354 cycle

export const getJavaDate = (target: Date) => {
  const diffTime = target.getTime() - refDateJava.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  let currentTotalDays = (refDayIdxJava + diffDays) % totalYearDaysJava;
  if (currentTotalDays <= 0) currentTotalDays += totalYearDaysJava;
  let daysLeft = currentTotalDays;
  let mIdx = 0;
  for (let i = 0; i < JAVA_MONTHS.length; i++) {
    if (daysLeft <= JAVA_MONTHS[i].days) { mIdx = i; break; }
    daysLeft -= JAVA_MONTHS[i].days;
  }
  return { day: daysLeft, month: JAVA_MONTHS[mIdx].name };
};

export const getPMDate = (target: Date) => {
  const m = target.getMonth();
  const d = target.getDate();
  const y = target.getFullYear();

  if (m === 1 && d === 29) return { day: '', name: '' };

  let anchorYear = y;
  if (m < 2) anchorYear--; 
  
  const anchor = new Date(anchorYear, 2, 1);
  const diffTime = target.getTime() - anchor.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  let dayInCycle = diffDays + 1; 

  if (dayInCycle > 364) return { day: '', name: '' };

  let daysLeft = dayInCycle;
  for (let i = 0; i < PM_ORDERED.length; i++) {
    if (daysLeft <= PM_ORDERED[i].days) {
      return { day: daysLeft, name: PM_ORDERED[i].name };
    }
    daysLeft -= PM_ORDERED[i].days;
  }
  return { day: '', name: '' };
};

export const getPasaran = (target: Date) => {
  const PASARAN_LIST = ['Pon - Abrit', 'Wage - Cemeng', 'Kliwon - Mancawarna', 'Legi - Pethak', 'Pahing - Jenih'];
  const refDate = new Date(1982, 4, 23); // 23 Mei 1982
  const diffTime = target.getTime() - refDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  let idx = (1 + diffDays) % 5; 
  if (idx < 0) idx += 5;
  return PASARAN_LIST[idx];
};

export const getNagadina = (neptu: number) => {
  const sisa = neptu % 4;
  if (sisa === 0) return 'Utara';
  if (sisa === 1) return 'Timur';
  if (sisa === 2) return 'Selatan';
  return 'Barat';
};

export const getDewaHarian = (nagaDina: string) => {
  if (nagaDina === 'Utara') return 'Bathara Wisnu';
  if (nagaDina === 'Timur') return 'Bathari Sri';
  if (nagaDina === 'Selatan') return 'Bathara Brahma';
  if (nagaDina === 'Barat') return 'Bathara Kala';
  return '-';
};

export const getWuku = (target: Date) => {
  const WUKU_LIST = [
    "1. Sinta - Ringkel", "2. Landep - Sonya", "3. Wukir - Donya", "4. Kuranthil -Malihan",
    "5. Tolu - Sonya", "6. Gumbreg - Nyawa", "7. Warigalit - Ringkel", "8. Warigagung - Sonya",
    "9. Julungwangi - Sonya", "10. Sungsang - Malihan", "11. Galungan - Sonya", "12. Kuningan - Nyawa",
    "13. Langkir - Ringkel", "14. Mandhasia - Sonya", "15. Julung Pujut - Donya", "16. Pahang - Malihan",
    "17. Kuruwelut = Sonya", "18. Marakeh - Sonya", "19. Tambir - Nyawa", "20. Madhangkungan - Sonya",
    "21. Maktal - Donya", "22. Wuye - Malihan", "23. Manahil - Sonya", "24. Prangbakat - Nyawa",
    "25. Bala - Ringkel", "26. Wugu - Sonya", "27. Wayang - Sonya", "28. Kulawu - Malihan",
    "29. Dukut - Sonya", "30. Watugunung - Sonya"
  ];
  const refSunday = new Date(2025, 1, 9); // Sunday
  const diffTime = target.getTime() - refSunday.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  let weeksSince = Math.floor(diffDays / 7);
  let idx = weeksSince % 30;
  if (idx < 0) idx += 30;
  return WUKU_LIST[idx];
};

export const getPadewan = (target: Date) => {
  const PADEWAN_LIST = [
    "Bathari Sri", "Bathara Indra", "Bathara Guru", "Bathara Nyamadipati",
    "Bathara Rudra", "Bathara Brahma", "Bathara Kala", "Bathari Uma"
  ];
  const refSunday = new Date(2025, 1, 9); // Sunday
  const diffTime = target.getTime() - refSunday.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  let weeksSince = Math.floor(diffDays / 7);
  let idx = weeksSince % 8;
  if (idx < 0) idx += 8;
  return PADEWAN_LIST[idx];
};

export const getPadangon = (target: Date) => {
  const PADANGON_LIST = ["Dangu", "Jagur", "Gigis", "Kerangan", "Nohan", "Wogan", "Tulus", "Wurung", "Dadi"];
  const refSintaSun = new Date(2025, 1, 9); 
  const diffDays = Math.round((target.getTime() - refSintaSun.getTime()) / (1000 * 60 * 60 * 24));
  const cyclesSince = Math.floor(diffDays / 210);
  const dayInWukuCycle = ((diffDays % 210) + 210) % 210;
  if (dayInWukuCycle === 0 || dayInWukuCycle === 1 || dayInWukuCycle === 2) return "Dangu";
  const effectiveDays = diffDays - (cyclesSince * 2) - 2;
  let idx = effectiveDays % 9;
  if (idx < 0) idx += 9;
  return PADANGON_LIST[idx];
};

export const getSifatHari = (target: Date) => {
  const SIFAT_LIST = [
    "1. Ringkel", "2. Sonya", "3. Donya", "4. Malihan", "5. Sonya", "6. Nyawa"
  ];
  const refDate = new Date(2025, 0, 1); // 1 Jan 2025
  const diffTime = target.getTime() - refDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  let idx = (3 + diffDays) % 6; 
  if (idx < 0) idx += 6;
  return SIFAT_LIST[idx];
};

export const getNeptu = (dayName: string, pasaran: string) => {
  const dayValues: Record<string, number> = {
    'Minggu': 5, 'Senin': 4, 'Selasa': 3, 'Rabu': 7, 'Kamis': 8, 'Jumat': 6, 'Sabtu': 9
  };
  const pasaranValues: Record<string, number> = {
    'Pahing': 9, 'Pon': 7, 'Wage': 4, 'Kliwon': 8, 'Legi': 5
  };
  
  let pVal = 0;
  for (const k in pasaranValues) {
    if (pasaran.includes(k)) {
      pVal = pasaranValues[k];
      break;
    }
  }
  
  const hVal = dayValues[dayName] || 0;
  return hVal + pVal;
};

export const getSTValue = (javaDay: number) => {
  return javaDay === 15 ? 'S' : (javaDay === 29 ? 'T' : '');
};

export const checkIs40 = (dayName: string, pasaran: string) => {
  const conditions = [
    { d: 'Selasa', p: 'Kliwon' },
    { d: 'Rabu', p: 'Legi' },
    { d: 'Kamis', p: 'Pahing' },
    { d: 'Rabu', p: 'Pon' },
    { d: 'Kamis', p: 'Wage' },
    { d: 'Jumat', p: 'Kliwon' },
    { d: 'Sabtu', p: 'Legi' },
    { d: 'Jumat', p: 'Pahing' },
    { d: 'Sabtu', p: 'Pon' },
    { d: 'Minggu', p: 'Wage' },
    { d: 'Sabtu', p: 'Kliwon' },
    { d: 'Minggu', p: 'Legi' },
    { d: 'Senin', p: 'Pahing' }
  ];
  return conditions.some(c => c.d === dayName && pasaran.includes(c.p));
};
