# Undangan Digital Lisa & Ilham

Versi ini sudah disiapkan untuk GitHub Pages. Tidak membutuhkan server, PostgreSQL, Drizzle, atau API.

## Upload ke GitHub

1. Buat repository GitHub.
2. Upload seluruh isi folder project ini ke repository.
3. Pastikan `package.json` dan folder `src` berada di root repository.
4. Buka Settings → Pages.
5. Pada Source pilih GitHub Actions.
6. Workflow yang disediakan akan menjalankan build dan deploy otomatis.

## Mengganti gambar

Semua gambar utama diatur dari:

`src/lib/data.ts`

Cari bagian:
- `bride.photo`
- `groom.photo`
- `coverPhoto`
- `heroPhoto`
- `savePhotos`
- `closingPhoto`
- `GALLERY`

Cara paling mudah memakai gambar sendiri:
1. Upload gambar ke `public/images/`.
2. Ubah URL, misalnya:
   `"/images/foto-cover.jpg"`
3. Commit perubahan.

Anda tidak perlu mengubah komponen React.

## Nama tamu

URL mendukung format:
`?to=Nama%20Tamu`

Contoh:
`https://USERNAME.github.io/NAMA-REPO/?to=Budi%20dan%20Keluarga`

## RSVP dan ucapan

Karena GitHub Pages hanya menyediakan hosting statis, RSVP dan ucapan pada versi ini disimpan di `localStorage` browser. Data tidak terkirim ke database dan tidak bisa dilihat oleh tamu lain.

Jika Anda ingin RSVP tersimpan bersama dan bisa dilihat semua tamu, gunakan Firebase atau layanan database/serverless lain.

## Musik

Sumber musik saat ini berada di `src/components/Invitation.tsx`.
Anda bisa menggantinya dengan file lokal di `public/music/` dan mengubah `<source src="...">`.

## Lokal

Jalankan:
`npm install`
`npm run dev`

Build GitHub Pages:
`npm run build`

Hasil static berada di folder `out/`.
