# Hoạt động
- userData chỉ lưu rule global, dùng cho mọi project. Khi mở project chưa có rule global nào đó trong .vibe/rules/, nó được chép xuống (không ghi đè bản đã có).
- .vibe/rules/ chỉ áp dụng trong project này. Metadata (tên, bật/tắt, agent được gán) lưu cùng ở đây.
# Liên kết
## modules/chat
- Rule đưa vào system prompt từ .vibe/rules/ (kèm tên/id). Chat trả lời câu hỏi về rule từ prompt, không gọi tool.
- Chat chỉ dùng tool khi người dùng yêu cầu tạo/sửa/xoá. Mặc định làm việc với rule local; chỉ đụng rule global khi người dùng nói rõ.
## modules/agent
- Gán agent trong giao diện rule; agent cũng gán/bỏ gán được trong giao diện agent. Việc gán lưu theo project.