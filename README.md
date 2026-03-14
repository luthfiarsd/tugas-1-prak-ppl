# Inventory API - Tugas 1 Praktikum PPL

![CI](https://github.com/luthfiarsd/tugas-1-prak-ppl/actions/workflows/ci.yml/badge.svg)
![Security](https://github.com/luthfiarsd/tugas-1-prak-ppl/actions/workflows/security.yml/badge.svg)

API RESTful untuk manajemen inventori barang, dibangun dengan Node.js + Express.

---

## Panduan Instalasi (Docker)

### Prasyarat

- Docker >= 20.x
- Docker Compose >= 2.x

### Menjalankan Aplikasi

\`\`\`bash

# Clone repository

git clone https://github.com/luthfiarsd/tugas-1-prak-ppl.git
cd tugas-1-prak-ppl

# Jalankan dengan Docker Compose (otomatis build)

docker-compose up --build

# Atau jalankan di background

docker-compose up --build -d

# Cek logs

docker-compose logs -f

# Stop

docker-compose down
\`\`\`

### Informasi Port

| Service | Host Port | Container Port |
| ------- | --------- | -------------- |
| API     | 3000      | 3000           |

### Akses API

- Base URL: `http://localhost:3000`
- Health Check: `http://localhost:3000/health`

---

## Dokumentasi API

### Base URL

\`\`\`
http://localhost:3000/api
\`\`\`

### Endpoint List

| Method | Endpoint       | Deskripsi                 |
| ------ | -------------- | ------------------------- |
| GET    | /health        | Health check server       |
| GET    | /api/items     | Ambil semua item          |
| GET    | /api/items/:id | Ambil item berdasarkan ID |
| POST   | /api/items     | Tambah item baru          |
| PUT    | /api/items/:id | Update item               |
| DELETE | /api/items/:id | Hapus item                |

### Query Parameters (GET /api/items)

| Parameter | Tipe   | Contoh               |
| --------- | ------ | -------------------- |
| category  | string | ?category=Elektronik |
| search    | string | ?search=laptop       |

---

### Contoh Request & Response

#### GET /api/items — Success

\`\`\`json
{
"success": true,
"message": "Data item berhasil diambil",
"data": {
"total": 2,
"items": [
{
"id": "uuid-xxx",
"name": "Laptop Asus VivoBook",
"category": "Elektronik",
"quantity": 15,
"price": 8500000,
"createdAt": "2024-01-01T00:00:00.000Z",
"updatedAt": "2024-01-01T00:00:00.000Z"
}
]
}
}
\`\`\`

#### POST /api/items — Success (201)

Request body:
\`\`\`json
{
"name": "Keyboard Mechanical",
"category": "Elektronik",
"quantity": 20,
"price": 750000
}
\`\`\`
Response:
\`\`\`json
{
"success": true,
"message": "Item berhasil ditambahkan",
"data": {
"id": "550e8400-e29b-41d4-a716-446655440000",
"name": "Keyboard Mechanical",
"category": "Elektronik",
"quantity": 20,
"price": 750000,
"createdAt": "2024-01-15T08:30:00.000Z",
"updatedAt": "2024-01-15T08:30:00.000Z"
}
}
\`\`\`

#### POST /api/items — Error Validasi (400)

\`\`\`json
{
"success": false,
"message": "Validasi gagal",
"errors": [
"category wajib diisi dan harus berupa string",
"price wajib diisi, harus angka, dan >= 0"
]
}
\`\`\`

#### GET /api/items/:id — Not Found (404)

\`\`\`json
{
"success": false,
"message": "Item dengan id 'abc-123' tidak ditemukan"
}
\`\`\`

---

## Alur Kerja Git

### Branch Strategy

\`\`\`
main → Produksi (protected, hanya merge dari develop)
develop → Staging/Integration
feature/_ → Pengembangan fitur baru
fix/_ → Perbaikan bug
\`\`\`

### Conventional Commits

\`\`\`bash
feat: menambahkan endpoint GET /api/items
feat: implementasi filter by category pada getAllItems
fix: memperbaiki validasi quantity yang tidak menolak nilai negatif
test: menambahkan unit test untuk deleteItem controller
chore: konfigurasi Dockerfile multi-stage build
ci: menambahkan workflow GitHub Actions untuk unit testing
docs: memperbarui README dengan dokumentasi endpoint lengkap
refactor: memisahkan logika validasi ke fungsi tersendiri
\`\`\`

### Contoh Alur Kerja

\`\`\`bash

# 1. Mulai dari develop

git checkout develop
git pull origin develop

# 2. Buat feature branch

git checkout -b feature/add-item-filter

# 3. Coding & commit dengan Conventional Commits

git add .
git commit -m "feat: menambahkan filter category pada endpoint GET /api/items"

# 4. Push ke remote

git push origin feature/add-item-filter

# 5. Buat Pull Request ke develop di GitHub

# 6. Setelah review & CI lulus → Merge ke develop

# 7. Setelah testing di develop → Merge ke main

\`\`\`

---

## ️ Status Automasi (GitHub Actions)

### CI Workflow (`ci.yml`)

Berjalan otomatis saat **push** atau **pull request** ke branch `main`, `develop`, `feature/**`.

| Step         | Deskripsi                            |
| ------------ | ------------------------------------ |
| Checkout     | Clone repository                     |
| Setup Node   | Install Node.js 18.x & 20.x (matrix) |
| Install Deps | `npm ci`                             |
| Unit Testing | `npm run test:ci` dengan coverage    |
| Docker Build | Build & test Docker container        |

### CS Workflow (`security.yml`)

Berjalan otomatis saat **push** ke `main`/`develop`, **PR** ke `main`, dan **terjadwal tiap Senin**.

| Step      | Deskripsi                     |
| --------- | ----------------------------- |
| NPM Audit | Scan kerentanan dependensi    |
| CodeQL    | Static analysis keamanan kode |
| Trivy     | Scan kerentanan Docker image  |
