# 🐕 Website Thương Mại Điện Tử Bán Thú Cưng

Backend được xây dựng bằng Express.js, MongoDB và TypeScript.

## 🚀 Tính Năng Chính

### 🔐 Xác Thực Người Dùng

- ✨ Đăng ký, đăng nhập thông thường
- 🔄 Đăng nhập với Google
- 🔒 JWT (JSON Web Token) cho bảo mật

### 📦 Quản Lý Sản Phẩm

- 🔍 Tìm kiếm và lọc sản phẩm
- 📄 Phân trang kết quả
- ⚡ Cache với Redis để tăng hiệu suất

### 🛒 Giỏ Hàng

- ➕ Thêm, xóa sản phẩm
- 🔄 Cập nhật số lượng
- 💰 Tính toán tổng giá

### 📝 Đặt Hàng

- 📦 Tạo đơn hàng từ giỏ hàng
- 📋 Xem lịch sử đơn hàng
- 🔄 Cập nhật trạng thái đơn hàng

### 💳 Thanh Toán

- 🔌 Tích hợp cổng thanh toán Stripe
- 🔄 Xử lý webhook từ Stripe
- 📊 Cập nhật trạng thái thanh toán đơn hàng

### 🤖 Chatbot Tư Vấn

- 💬 Phản hồi dựa trên từ khóa
- 🔍 Tìm kiếm sản phẩm liên quan
- ❓ Trả lời các câu hỏi thường gặp

### 🚀 Redis Cache

- ⚡ Cache kết quả tìm kiếm sản phẩm
- 🔄 Tự động xóa cache khi dữ liệu thay đổi
- ⚡ Cải thiện tốc độ phản hồi
