# Sistem Review Kantin

Aplikasi web **Sistem Review Kantin** yang mengintegrasikan frontend React (TypeScript) dengan REST API backend Express.js dan database SQL Server. Aplikasi ini mencakup fitur manajemen data warung (*stalls* CRUD), pencarian, filter, pagination, serta autentikasi dan otorisasi berbasis role (`Admin`, `Owner`, `Customer`).

---

## Teknologi yang Digunakan

### Backend
- **Runtime & Framework:** Node.js, Express.js
- **Bahasa:** TypeScript
- **Database & ORM:** SQL Server, Drizzle ORM
- **Autentikasi & Validasi:** JSON Web Token (`jsonwebtoken`), `bcryptjs`, Zod
- **Dokumentasi & Middleware:** Swagger UI, CORS

### Frontend
- **Library & Framework:** React v18, Vite
- **Bahasa:** TypeScript
- **HTTP Client:** Axios (dengan *Request Interceptor* untuk menyisipkan header `Authorization: Bearer <token>`)
- **Routing:** React Router DOM v6
- **Styling:** CSS

---

## Instalasi

### 1. Instalasi Backend
Masuk ke direktori `Backend` dan install seluruh dependensi:
```bash
cd Backend
npm install
```

### 2. Instalasi Frontend
Buka terminal baru, masuk ke direktori `Frontend`, dan install seluruh dependensi:
```bash
cd Frontend
npm install
```

---

## Konfigurasi Environment

### 1. Environment Backend (`Backend/.env`)
Salin file `Backend/.env.example` menjadi `Backend/.env`, lalu sesuaikan nilainya dengan konfigurasi lokal:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=your_database_password
DB_NAME=nama_database_kantin
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=2h
BCRYPT_SALT_ROUNDS=10
```

### 2. Environment Frontend (`frontend-review-kantin/.env`)
Salin file `frontend-review-kantin/.env.example` menjadi `frontend-review-kantin/.env`:
```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## Cara Menjalankan Aplikasi

Pastikan layanan **SQL Server** sudah aktif terlebih dahulu sebelum menjalankan server backend.

### 1. Menjalankan Server Backend
Buka terminal pertama, masuk ke folder `Backend`, lalu jalankan server:
```bash
cd Backend
npm run dev
```
Jika berhasil, terminal akan menampilkan pesan `Server berjalan di http://localhost:3000` (dokumentasi API Swagger dapat diakses di `http://localhost:3000/docs`).

### 2. Menjalankan Aplikasi Frontend
Buka terminal kedua (biarkan terminal backend tetap berjalan), masuk ke folder `frontend-review-kantin`, lalu jalankan aplikasi React:
```bash
cd frontend-review-kantin
npm run dev
```
Aplikasi frontend akan berjalan dan dapat diakses melalui browser di `http://localhost:5173`.

---
