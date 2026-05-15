Dự án Quản lý Giải đấu Esports (BTL Cuối Kỳ)

Hệ thống quản lý giải đấu Esports chuyên nghiệp sử dụng công nghệ Node.js, React (UmiJS) và MySQL.

Công nghệ sử dụng
- Frontend: React, UmiJS, Ant Design Pro
- Backend: Node.js, Express, TypeScript
- Database: MySQL, Prisma ORM
Hướng dẫn cài đặt và chạy
1. Cấu hình Database
- Tạo database mới trong MySQL với tên: `esports_db`
- Vào thư mục `backend`, copy file `.env.example` thành `.env` và sửa lại mật khẩu MySQL của thầy ạ.
2. Cài đặt Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed  
npm run dev
```

Nhóm đưa 1 số dữ liệu mẫu vào db để tiện test:
- ADMIN: admin@example.com / 123456
- USER: user@example.com / 123456
3. Cài đặt Frontend
```bash
cd frontend
npm install
npm run dev


