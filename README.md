# QAirline admin website

Đây là trang web dành cho người quản trị của hãng hàng không QAirline, giúp người quản trị dễ dàng lên lịch bay, quản lý các chuyến bay, quản lý lượng vé cũng như đăng các thông tin của hãng.

## Mục lục

1. [Tính năng](#tính-năng)
2. [Công nghệ](#công-nghệ)
3. [Cài đặt](#cài-đặt)
4. [Sử dụng](#sử-dụng)
5. [Cấu trúc dự án](#cấu-trúc-dự-án)

## Tính năng:

- Quản lý chuyến bay:
  - Tạo chuyến bay
  - Lên lịch trình bay
  - Delay chuyến bay
  - Hủy chuyến
  - Đổi máy bay
- Quản lý máy bay:
  - Thêm máy bay mới
  - Xóa máy bay
  - Sửa số ghế
- Quản lý vé:
  - Xem thống kê vé khách hàng đã đặt
  - Lọc vé theo các tiêu chí
- Quản lý thông tin của hãng:
  - Thêm, sửa, xóa tin tức
  - Thêm, sửa, xóa khuyến mãi
  - Thêm, sửa, xóa hướng dẫn

## Công nghệ

Dự án sử dụng những công nghệ / framework / thư viện sau:

- ReactJS
- Material UI
- Tailwind CSS

Look and feel của trang web được thiết lập bằng cách đặt lại các màu chủ đề cho theme của tailwind CSS và theme của Material UI.

Tailwind CSS và Material UI được sử dụng với mục đích chính là rút ngắn mã nguồn và thời gian lập trình. Các thuộc tính style của các component gần như đều được viết lại để đảm bảo look and feel của trang web.

## Cài đặt

Sau khi đã tải và giải nén project này, chạy lệnh sau đây để cài đặt các thư viện của dự án

```bash
npm install
```

## Sử dụng

Gõ lệnh sau trong terminal ở directory của dự án để chạy:

```bash
npm run dev
```

Truy cập vào trình duyệt tại địa chỉ:

```
http://localhost:5173/
```

## Cấu trúc dự án

```plaintext
src/
├── apis/                # Các API giao tiếp với server.
├── app/                 # Redux store và các slice.
├── assets/              # Các ảnh
├── components/          # Các component dùng chung.
├── pages/               # Các trang chính của ứng dụng.
├── utils/               # Các tiện ích và hàm xử lý.
└── main.jsx             # Điểm khởi đầu của ứng dụng.
```
