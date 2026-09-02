# ข้อสอบกลางภาค (ภาคปฏิบัติ) · วิชา DevOps 30901-2008
### วิทยาลัยเทคนิคเลย · แผนกวิชาเทคโนโลยีสารสนเทศ

![CI - compuroom](https://github.com/Lazy1968/compuroom-68319010010/actions/workflows/ci.yml/badge.svg)
![Docker Pulls](https://img.shields.io/badge/docker-ready-blue.svg?logo=docker)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg?logo=postgresql)
![Vue 3](https://img.shields.io/badge/Vue.js-3.x-emerald.svg?logo=vuedotjs)

---

## 🪪 ข้อมูลผู้จัดทำ (Student Information)
- **ชื่อ-นามสกุล**: นายพีระพัฒน์ คำแหงพล
- **รหัสนักศึกษา**: `68319010010`
- **ระดับชั้น / กลุ่มเรียน**: ปวส.2 เทคโนโลยีสารสนเทศ (ทส.2/1)
- **รหัสวิชา**: 30901-2008 การปฏิบัติการเดฟออปส์ (DevOps Practices)
- **โจทย์ที่ได้รับ (โจทย์ที่ 1)**: `compuroom` — ระบบบันทึกข้อมูลเครื่องคอมพิวเตอร์ประจำห้องปฏิบัติการ

---

## 🖥️ รายละเอียดระบบ (System Overview)
ระบบบันทึกและบริหารจัดการข้อมูลเครื่องคอมพิวเตอร์ในห้องปฏิบัติการของแผนกวิชา (CRUD Application) พัฒนาขึ้นตามแนวทาง DevOps ครบวงจรตั้งแต่ Source Code Management, Containerization, Automated Testing ไปจนถึง Continuous Integration (CI)

### 🌟 ฟังก์ชันหลัก
1. **Create (เพิ่มข้อมูล)**: บันทึกข้อมูลเครื่องใหม่ (รหัสครุภัณฑ์, ยี่ห้อ/รุ่น, CPU, RAM, ห้อง, สถานะ) พร้อมระบบป้องกันรหัสซ้ำ
2. **Read (แสดงข้อมูล & ค้นหา)**: แสดงตารางข้อมูลคอมพิวเตอร์ทั้งหมด, ค้นหาแบบเรียลไทม์ (Search Box), กรองตามสถานะ และกรองตามห้อง
3. **Update (แก้ไขข้อมูล)**: แก้ไขข้อมูลสเปก ห้อง และสถานะการใช้งาน
4. **Delete (ลบข้อมูล)**: ลบข้อมูลพร้อมหน้าต่างยืนยัน (Confirmation Modal)
5. **System Health Check**: ตรวจสอบสถานะการทำงานของ API และ Database ผ่าน `/health`

---

## 🔌 ตาราง REST API Endpoints

| Method | Endpoint | คำอธิบาย | Request Body | Response (Success) | Status Code |
|---|---|---|---|---|---|
| **GET** | `/health` | ตรวจสอบสถานะ API | ไม่มี | `{"status":"ok", "version":"1.0.0", ...}` | `200 OK` |
| **GET** | `/api/computers` | ดึงรายการคอมพิวเตอร์ทั้งหมด | Query params: `?status=&room=&search=` | `[{ "id": 1, "asset_code": "COM-01", ... }]` | `200 OK` |
| **GET** | `/api/computers/:id` | ดึงข้อมูลคอมพิวเตอร์รายเครื่อง | ไม่มี | `{"id": 1, "asset_code": "COM-01", ...}` | `200 OK` / `404 Not Found` |
| **POST** | `/api/computers` | บันทึกข้อมูลเครื่องใหม่ | `{ asset_code, brand_model, cpu, ram_gb, room, status }` | `{"id": 5, "asset_code": "COM-05", ...}` | `201 Created` / `400 Bad Request` |
| **PUT** | `/api/computers/:id` | แก้ไขข้อมูลเครื่องคอมพิวเตอร์ | `{ asset_code, brand_model, cpu, ram_gb, room, status }` | `{"id": 1, "asset_code": "COM-01", ...}` | `200 OK` / `404 Not Found` |
| **DELETE**| `/api/computers/:id` | ลบข้อมูลเครื่องคอมพิวเตอร์ | ไม่มี | `{"message": "ลบข้อมูลเรียบร้อยแล้ว", ...}` | `200 OK` / `404 Not Found` |

---

## 🐳 วิธีการรันโปรเจกต์ (Deployment & Running Instructions)

### แบบที่ 1: Local Development (Build & Run ด้วย Docker Compose)
เหมาะสำหรับการรันบนเครื่องตนเองหรือการทดสอบโค้ดล่าสุด:

```bash
# 1. คัดลอกไฟล์ Environment Variables
cp .env.example .env

# 2. สั่ง build และ start container ทั้ง 3 services (db, backend, frontend)
docker compose up -d --build

# 3. เข้าใช้งานผ่าน Web Browser:
# Frontend UI:  http://localhost:8080
# Backend API:  http://localhost:5000/api/computers
# Health Check: http://localhost:5000/health
```

---

### แบบที่ 2: Production (Pull Images สำเร็จรูปจาก Docker Hub)
ไม่ต้อง build โค้ดใหม่ สามารถรันได้ทันทีบนเครื่องเซิร์ฟเวอร์หรือเครื่องตรวจข้อสอบ:

```bash
# รันผ่าน production compose file
docker compose -f docker-compose.prod.yml up -d

# ตรวจสอบสถานะ container
docker compose -f docker-compose.prod.yml ps
```

---

## 📦 Docker Hub Repositories
- **Backend API Image**: [phirapat/compuroom-api](https://hub.docker.com/r/phirapat/compuroom-api)
  - `phirapat/compuroom-api:latest`
  - `phirapat/compuroom-api:v1.0.0`
- **Frontend Web Image**: [phirapat/compuroom-web](https://hub.docker.com/r/phirapat/compuroom-web)
  - `phirapat/compuroom-web:latest`
  - `phirapat/compuroom-web:v1.0.0`

---

## 🔄 CI Pipeline Workflow (GitHub Actions)
ไฟล์ Workflow ตั้งอยู่ที่ `.github/workflows/ci.yml` โดยทำงานอัตโนมัติเมื่อ:
- มีการ **Push** เข้า branch `develop` หรือ `feature/**`
- มีการสร้าง **Pull Request** เข้าสู่ `main` หรือ `develop`

### 3 ลำดับการทำงาน (Sequential Jobs):
1. **`lint` (Code Quality)**: ตรวจสอบความถูกต้องของไวยากรณ์และ Style ด้วย ESLint
2. **`test` (Automated Testing)**: รัน Unit Test & Integration Test ด้วย Jest + Supertest (≥ 5 test cases)
3. **`build` (Docker Verification)**: ทดสอบ `docker build` ทั้งภาพ backend และ frontend (multi-stage) ให้มั่นใจว่า build ผ่าน 100%

---

## 🌿 Git Branching Strategy & Conventional Commits

### Branching Model:
- `main` ➔ Production branch (รองรับเฉพาะการ merge ผ่าน Pull Request จาก `develop`)
- `develop` ➔ Development integration branch (รวมฟีเจอร์ก่อนปล่อยขึ้น main)
- `feature/*` ➔ ฟีเจอร์ย่อย (เช่น `feature/crud-api`, `feature/frontend-ui`, `feature/docker-ci`)

### Commit Messages ตัวอย่าง:
- `feat: add GET, POST, PUT, DELETE /api/computers endpoints`
- `feat: create Vue 3 responsive UI with stats and modals`
- `ci: configure GitHub Actions 3-stage pipeline (lint, test, build)`
- `docs: update README with API table and running guides`

---

## 🎤 แนวทางการตอบข้อสอบซักถาม (Oral Defense Cheat Sheet)

> สรุปคำอธิบายสำหรับตอบกรรมการคุมสอบ 5–10 นาที:

1. **🌿 ทำไมต้อง merge ผ่าน Pull Request แทนการ push ตรงเข้า main?**
   - **คำตอบ**: เพื่อป้องกันโค้ดที่ยังไม่ผ่านการทดสอบหลุดเข้าสู่สายการผลิต (Production) การเปิด PR ทำให้ทีมสามารถ Code Review และกระตุ้นให้ CI Pipeline ตรวจสอบ lint และ unit test โดยอัตโนมัติก่อนที่จะนำมารวมกัน

2. **⚡ อธิบายการไหลของข้อมูล (Data Flow) เมื่อกดปุ่ม "บันทึก" บนหน้าเว็บ?**
   - **คำตอบ**: เมื่อผู้ใช้กรอกฟอร์มแล้วกดบันทึก ➔ Vue 3 ส่ง HTTP POST Request แบบ JSON ไปยัง Backend (`/api/computers`) ➔ Express ตรวจสอบความถูกต้อง (Validation) ➔ เรียกใช้ PostgreSQL Pool ส่งคำสั่ง `INSERT INTO computers ...` ➔ DB บันทึกข้อมูลและส่งแถวข้อมูลที่สร้างขึ้นกลับมา ➔ Express ตอบกลับ Status 201 Created ➔ Frontend อัปเดตข้อมูลบนหน้าจอทันที

3. **🐳 ทำไม Frontend ต้องใช้ Multi-stage build ใน Dockerfile?**
   - **คำตอบ**: ในขั้นตอนพัฒนาเราต้องการ Node.js และ npm เพื่อ compile โค้ด Vue/Vite แต่เมื่อ build เสร็จเป็นไฟล์ HTML/JS/CSS (Static) ใน production เราต้องการเพียง Web Server น้ำหนักเบาอย่าง **Nginx Alpine** มาเสิร์ฟไฟล์ ทำให้ Image มีขนาดเล็กมาก (ลดจาก ~300MB เหลือเพียง ~25MB) ปลอดภัยและโหลดเร็วขึ้น

4. **🐳 Image ต่างจาก Container อย่างไร และถ้าลบ container ของ db ข้อมูลจะหายหรือไม่?**
   - **คำตอบ**: Image คือ Template/พิมพ์เขียวที่อ่านได้อย่างเดียว (Read-only Blueprint) ส่วน Container คือ Instance ที่ถูกรันขึ้นมาจาก Image นั้น / ข้อมูลใน Database **จะไม่หาย** เพราะมีการผูก Docker Named Volume (`pgdata`) ไว้ที่ Host Storage ทำให้ข้อมูลคงทน (Persistent) แม้จะสั่ง `docker rm` หรือ restart container ก็ตาม

5. **📦 Tag `latest` กับ `v1.0.0` ต่างกันอย่างไร?**
   - **คำตอบ**: `latest` ชี้ไปยังเวอร์ชันล่าสุดที่เพิ่ง build เสมอ ส่วน `v1.0.0` เป็น Semantic Versioning (SemVer) ที่ระบุเวอร์ชันนิ่งแบบตายตัว เหมาะสำหรับ Production เพื่อป้องกันปัญหา Breaking Change เมื่อมีการอัปเดตโค้ด

6. **🔄 เมื่อ push โค้ดขึ้น develop เกิดอะไรขึ้นใน CI Pipeline? และถ้า test แดง จะเกิดอะไรขึ้น?**
   - **คำตอบ**: GitHub Actions จะเริ่มต้นทำงานตามลำดับ `lint` ➔ `test` ➔ `build` หาก job `test` ไม่ผ่าน (สถานะเป็นสีแดง) Job `build` ที่ตั้งค่า `needs: test` ไว้จะถูกยกเลิก (Skipped/Blocked) ทันที เพื่อป้องกันไม่ให้ Image ที่มีบั๊กถูกนำไป build หรือ deploy ต่อ
