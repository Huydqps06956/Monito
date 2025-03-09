backend cho website thương mại điện tử bán thú cưng (chó) và phụ kiện, sử dụng Express.js, MongoDB, Typescript. Hệ thống bao gồm các tính năng:
Tính năng chính:

Xác thực người dùng:

Đăng ký, đăng nhập thông thường
Đăng nhập với Google
JWT (JSON Web Token) cho bảo mật


Quản lý sản phẩm:

Tìm kiếm và lọc sản phẩm
Phân trang kết quả
Cache với Redis để tăng hiệu suất


Giỏ hàng:

Thêm, xóa sản phẩm
Cập nhật số lượng
Tính toán tổng giá


Đặt hàng:

Tạo đơn hàng từ giỏ hàng
Xem lịch sử đơn hàng
Cập nhật trạng thái đơn hàng


Thanh toán:

Tích hợp cổng thanh toán Stripe
Xử lý webhook từ Stripe
Cập nhật trạng thái thanh toán đơn hàng


Chatbot tư vấn:

Phản hồi dựa trên từ khóa
Tìm kiếm sản phẩm liên quan
Trả lời các câu hỏi thường gặp


Redis cache:

Cache kết quả tìm kiếm sản phẩm
Tự động xóa cache khi dữ liệu thay đổi
Cải thiện tốc độ phản hồi


