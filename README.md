# Inventory API — Tugas 1 Praktikum PPL

![CI](https://github.com/luthfiarsd/tugas-1-prak-ppl/actions/workflows/ci.yml/badge.svg)
![Security](https://github.com/luthfiarsd/tugas-1-prak-ppl/actions/workflows/security.yml/badge.svg)

RESTful API manajemen inventori barang, dibangun dengan **Node.js + Express**, terintegrasi penuh dengan **Docker** dan **GitHub Actions** (CI/CS).

---

## Daftar Isi

- [Instalasi & Menjalankan](#instalasi--menjalankan)
- [Dokumentasi API](#dokumentasi-api)
- [Git Workflow](#git-workflow)
- [Docker](#docker)
- [GitHub Actions CI/CS](#github-actions-cics)

---

## Instalasi & Menjalankan

### Prasyarat

- Node.js >= 18.x
- Docker >= 20.x & Docker Compose >= 2.x

### Tanpa Docker (Lokal)

```bash
git clone https://github.com/luthfiarsd/tugas-1-prak-ppl.git
cd tugas-1-prak-ppl
npm install
npm run dev       # development (hot-reload)
npm start         # production
npm test          # unit test + coverage
```

### Dengan Docker

```bash
# Development (hot-reload via volume mount)
docker compose -f docker-compose.dev.yml up --build

# Production
docker compose up --build -d

# Cek logs
docker compose logs -f

# Stop
docker compose down
```

### Informasi Port

| Service | Host Port | Container Port |
| ------- | --------- | -------------- |
| API     | 3000      | 3000           |

### Akses API

- Base URL: `http://localhost:3000`
- Health Check: `http://localhost:3000/health`

---

## Dokumentasi API

### Endpoint

| Method | Endpoint         | Deskripsi                 |
| ------ | ---------------- | ------------------------- |
| GET    | `/health`        | Health check server       |
| GET    | `/api/items`     | Ambil semua item          |
| GET    | `/api/items/:id` | Ambil item berdasarkan ID |
| POST   | `/api/items`     | Tambah item baru          |
| PUT    | `/api/items/:id` | Update item               |
| DELETE | `/api/items/:id` | Hapus item                |

### Query Parameters — `GET /api/items`

| Parameter  | Tipe   | Deskripsi                                                            | Contoh                 |
| ---------- | ------ | -------------------------------------------------------------------- | ---------------------- |
| `category` | string | Filter exact match kategori (case-insensitive)                       | `?category=Elektronik` |
| `search`   | string | Cari di nama **dan** kategori (case-insensitive)                     | `?search=laptop`       |
| `minPrice` | number | Filter item dengan harga >= nilai                                    | `?minPrice=500000`     |
| `maxPrice` | number | Filter item dengan harga <= nilai                                    | `?maxPrice=1000000`    |
| `sortBy`   | string | Urutkan berdasarkan field (`name`, `price`, `quantity`, `createdAt`) | `?sortBy=price`        |
| `order`    | string | Arah urutan: `asc` (default) atau `desc`                             | `?order=desc`          |

Semua parameter opsional dan dapat dikombinasikan:

```
GET /api/items?search=elektronik&minPrice=500000&sortBy=price&order=desc
```

### Body Request (POST & PUT)

```json
{
  "name": "Keyboard Mechanical",
  "category": "Elektronik",
  "quantity": 20,
  "price": 750000
}
```

| Field      | Tipe   | Validasi                    |
| ---------- | ------ | --------------------------- |
| `name`     | string | Wajib, tidak boleh kosong   |
| `category` | string | Wajib, tidak boleh kosong   |
| `quantity` | number | Wajib, harus angka dan >= 0 |
| `price`    | number | Wajib, harus angka dan >= 0 |

### Contoh Response

**GET /api/items — 200 OK**

```json
{
  "success": true,
  "message": "Data item berhasil diambil",
  "data": {
    "total": 1,
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
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
```

**POST /api/items — 201 Created**

```json
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
```

**POST /api/items — 400 Bad Request (validasi gagal)**

```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    "category wajib diisi dan harus berupa string",
    "price wajib diisi, harus angka, dan >= 0"
  ]
}
```

**GET /api/items/:id — 404 Not Found**

```json
{
  "success": false,
  "message": "Item dengan id 'abc-123' tidak ditemukan"
}
```

---

## Git Workflow

### Struktur Branch

```
main          ← production-ready, protected
develop       ← integrasi fitur, branch utama development
feature/*     ← pengembangan fitur baru (dari develop)
fix/*         ← perbaikan bug (dari develop)
hotfix/*      ← perbaikan darurat (dari main)
```

### Conventional Commits

Format: `<type>(<scope>): <deskripsi>`

| Type       | Kapan Digunakan                      |
| ---------- | ------------------------------------ |
| `feat`     | Menambah fitur baru                  |
| `fix`      | Memperbaiki bug                      |
| `test`     | Menambah atau memperbaiki test       |
| `docs`     | Perubahan dokumentasi saja           |
| `refactor` | Refactoring tanpa fix/feat           |
| `chore`    | Build process, dependency, tooling   |
| `ci`       | Perubahan file CI/CD                 |
| `style`    | Format kode (spasi, titik koma, dll) |
| `perf`     | Peningkatan performa                 |

### Langkah Commit dari Awal

#### 1. Inisialisasi Repository

```bash
git init
git remote add origin https://github.com/<username>/<repo>.git
```

#### 2. Setup Branch Utama

```bash
# Push branch main
git add .
git commit -m "chore: initial project setup"
git push -u origin main

# Buat dan push branch develop
git checkout -b develop
git push -u origin develop
```

#### 3. Mulai Fitur Baru

```bash
# Selalu mulai dari develop yang terbaru
git checkout develop
git pull origin develop

# Buat feature branch
git checkout -b feature/nama-fitur
```

#### 4. Kerjakan & Commit

```bash
# Setelah mengubah file
git add src/controllers/itemController.js
git commit -m "feat(items): add price range filter and sort query params"

# Setelah menulis test
git add tests/item.test.js
git commit -m "test(items): add tests for minPrice, maxPrice, and sortBy"

# Setelah update docs
git add README.md
git commit -m "docs: update query parameters table in README"
```

#### 5. Push Feature Branch

```bash
git push -u origin feature/nama-fitur
```

#### 6. Buat Pull Request #1 (feature → develop)

Buka GitHub → muncul banner _"Compare & pull request"_ → atur:

- **base:** `develop`
- **compare:** `feature/nama-fitur`
- **Judul:** ikuti format Conventional Commits

CI akan berjalan otomatis. Setelah hijau dan di-review → Merge.

#### 7. Cleanup Feature Branch

```bash
git checkout develop
git pull origin develop
git branch -d feature/nama-fitur
```

#### 8. Buat Pull Request #2 (develop → main)

```bash
# Pastikan develop sudah up-to-date
git checkout develop
git pull origin develop
```

Buka GitHub → buat PR:

- **base:** `main`
- **compare:** `develop`
- **Judul:** `chore: release v1.x.x`

CI + CS (security scan) berjalan otomatis. Setelah semua hijau → Merge.

#### 9. Tag Versi (Opsional)

```bash
git checkout main
git pull origin main
git tag -a v1.1.0 -m "release: v1.1.0"
git push origin v1.1.0
```

---

## Docker

### Dockerfile Multi-Stage

| Stage         | Digunakan Untuk                           |
| ------------- | ----------------------------------------- |
| `base`        | Base image dengan production dependencies |
| `development` | Hot-reload dengan nodemon (dev only)      |
| `production`  | Image ringan, non-root user, siap deploy  |

```bash
# Build manual
docker build --target production -t tugas-1-prak-ppl:latest .

# Jalankan manual
docker run -d -p 3000:3000 --name api tugas-1-prak-ppl:latest

# Cek health
curl http://localhost:3000/health
```

---

## GitHub Actions CI/CS

### CI Workflow (`ci.yml`)

Trigger: push/PR ke `main`, `develop`, `feature/**`

| Job            | Langkah                                         |
| -------------- | ----------------------------------------------- |
| `test`         | Setup Node 18 & 20, `npm ci`, `npm run test:ci` |
| `docker-build` | Build Docker production image, test `/health`   |

Job `docker-build` hanya berjalan jika `test` lulus.

### CS Workflow (`security.yml`)

Trigger: push/PR ke `main`/`develop`, dan terjadwal tiap Senin 06:00 UTC

| Job         | Langkah                                     |
| ----------- | ------------------------------------------- |
| `npm-audit` | Scan kerentanan npm dependencies            |
| `codeql`    | Static analysis keamanan kode (JavaScript)  |
| `trivy`     | Scan kerentanan OS packages di Docker image |
