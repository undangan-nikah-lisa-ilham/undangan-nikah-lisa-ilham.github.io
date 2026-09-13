const img = (file: string) => `images/${encodeURI(file)}`;

export const WEDDING = {
  brideShort: "Lisa",
  groomShort: "Ilham",
  bride: {
    name: "Lisa Fitri Anggraeni",
    parents: "Bapak Ratin & Ibu Sukarni",
    order: "Putri pertama dari",
    instagram: "l1130.are",
    photo: img("Mempelai Wanita (The Bride) Foto Lisa Fitri Anggraeni.webp"),
  },
  groom: {
    name: "Moh. Ilham Al Ubaidah",
    parents: "Bapak Mustakim & Ibu Paisih",
    order: "Putra kedua dari",
    instagram: "danteaja2025",
    photo: img("Mempelai Pria (The Groom) Foto Moh. Ilham Al Ubaidah.webp"),
  },
  dateLabel: "Minggu, 8 November 2026",
  dateShort: "08 · 11 · 2026",
  targetDate: "2026-11-08T08:00:00+07:00",
  venue: "Kediaman Bapak Ratin sekeluarga",
  address:
    "Dusun Bulung, Desa Bayem, Kec. Kasembon, Kab. Malang, Jawa Timur 65393",
  mapUrl: "https://maps.app.goo.gl/y3B5ypkFUSQzE4y37",
  akad: "08:00 - 10:00 WIB",
  resepsi: "10:00 - 21:00 WIB",
  coverPhoto: img("Cover.webp"),
  heroPhoto: img("Hero.webp"),
  savePhotos: [
    img("Save The Date kiri.webp"),
    img("Save The Date kanan.webp"),
  ],
  closingPhoto: img("Closing.webp"),
  whatsappUrl: "https://wa.me/6281946798848",
  contactMapUrl: "https://maps.app.goo.gl/Kk4SD3CoJ7uB9Hpu5/",
} as const;

export const GALLERY: { src: string; caption: string }[] = [
  { src: img("Galeri 1.webp"), caption: "Kenangan pertama kami" },
  { src: img("Galeri 2.webp"), caption: "Balutan adat dan doa" },
  { src: img("Galeri 3.webp"), caption: "Senyum yang sama" },
  { src: img("Galeri 4.webp"), caption: "Menuju hari bahagia" },
];

export const STORY: { time: string; title: string; text: string }[] = [
  {
    time: "19 Desember 2025",
    title: "Awal Mula",
    text: "Sebuah sapaan sederhana menjadi permulaan dari cerita indah ini. Tak ada yang menyangka obrolan singkat malam itu akan berlanjut sejauh ini.",
  },
  {
    time: "03 Januari 2026",
    title: "Pertemuan Pertama",
    text: "Pertama kali bertatap muka di sebuah kedai kecil, dan merasakan getaran hati yang hangat serta obrolan yang tak ingin cepat selesai.",
  },
  {
    time: "07 Juni 2026",
    title: "Semakin Dekat",
    text: "Hari demi hari saling menguatkan, saling mengenal keluarga, dan memantapkan keyakinan bahwa ini adalah jalan yang benar.",
  },
  {
    time: "17 Agustus 2026",
    title: "Lamaran & Komitmen",
    text: "Di hadapan keluarga besar, ikatan janji suci diresmikan. Doa restu mengalir dari orang-orang tercinta.",
  },
  {
    time: "08 November 2026",
    title: "Hari Pernikahan",
    text: "Hari ketika cinta kami disatukan dalam ikrar untuk selamanya. Kehadiran dan doa Anda adalah hadiah terindah.",
  },
];

export const BANKS: {
  bank: string;
  number: string;
  holder: string;
  badgeClass: string;
}[] = [
  {
    bank: "BNI",
    number: "1695139954",
    holder: "Lisa Fitri Anggraeni",
    badgeClass: "bg-orange-50 text-orange-700",
  },
  {
    bank: "BCA",
    number: "2251332128",
    holder: "Moh. Ilham Al Ubaidah",
    badgeClass: "bg-blue-50 text-blue-700",
  },
];

export const GIFT_ADDRESS = {
  label: "Kirim Kado",
  receiver: "Lisa & Ilham",
  detail:
    "Dusun Bulung, Desa Bayem, Kecamatan Kasembon Kabupaten Malang, Jawa Timur 65393",
};
