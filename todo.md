# Quyết định thiết kế (tổng hợp)

## C. Module `extension`: nguyên tắc

- Ext chỉ giao tiếp với app qua 2 cửa: khai báo setting (dữ liệu) và gọi command (do module khác công bố).
- Tái dùng cái có sẵn: capability `setting-source`, whitelist target, `guard.js`, mẫu `platform/index.js` của terminal (thêm ngôn ngữ = thêm 1 file).
- Ext chạy ở main process trong `worker_threads`, không có `require`/`fs`, chỉ nhận các đối tượng host đưa vào.
- Ext là file thật, trạng thái lưu riêng trong storage.

## D. Use case

**P0 (phạm vi bản đầu)**

| # | Use case |
|---|---|
| UC1 | Danh sách ext: tên, ngôn ngữ, bật/tắt, trạng thái (Đang chạy / Tắt / Lỗi + lý do) |
| UC2 | Tạo ext (xem mục E) |
| UC3 | Sửa code, lưu xong tự reload nếu đang bật. Lỗi hiện toast và ở dòng ext |
| UC4 | Bật/tắt: tắt thì dừng code và ẩn setting, giá trị user đã đặt vẫn giữ |
| UC5 | Xóa ext (có confirm), xóa luôn giá trị setting của ext |
| UC6 | Ext khai báo setting, hiện trong Settings |
| UC7 | User đổi giá trị thì ext chạy lại với giá trị mới |
| UC8 | Module công bố command trong `backend/setting/command/` |
| UC9 | Ext gọi command, kiểm tra tên và args, lệnh lạ bị từ chối |
| UC10 | Ext lỗi, treo hoặc lặp vô hạn thì timeout và ghi log. Tự tắt sau N lần crash, app không sập |

**P1:** control hiển thị (switch, dropdown, radio, slider, text, textarea, color), xem danh sách command, `permissions` do user duyệt.
**P2:** ngôn ngữ thứ 2, trang setting tùy biến (iframe sandbox), AI tạo/sửa ext qua `@extension`.

## E. UC2 (đã đổi)

- Trang chi tiết hiện khối **"Code mẫu"** dạng text chỉ đọc, có nút **Copy**. User có thể dán vào `index.js`.
- `runtimes/<lang>.js` chỉ trả về chuỗi mẫu để hiển thị, không ghi vào file.

## F. Hợp đồng ext (đã chốt)

```js
// VD Tự động lưu: cứ vài giây lại lưu các file đã sửa.

module.exports = {
  name: "Tự động lưu",

  settings: {
    enabled: { label: "Bật tự động lưu", default: false },
    seconds: { label: "Lưu sau mỗi (giây)", default: 5, options: [2, 5, 30] },
  },

  run({ settings, commands }) {
    if (!settings.enabled) return;

    setInterval(() => {
      commands.editor.saveAll();
    }, settings.seconds * 1000);
  },
};
```

- 3 phần `name`, `settings`, `run` đều tùy chọn. `module.exports = {}` vẫn hợp lệ.
- Host tự làm các việc sau:

| Việc | Cách xử lý |
|---|---|
| Setting id | Ghép `<extId>.<key>` |
| owner | `<extId>` |
| group | `name`, không có thì `<extId>` |
| type | Suy từ `default` (boolean / number / string) |
| control | boolean → switch, có `options` → dropdown, số → ô nhập, chuỗi → ô text |
| Chạy lại `run` | Tự chạy lại mỗi khi setting đổi |
| Dọn timer | Tự hủy mọi timer khi `run` chạy lại, khi tắt ext và khi reload. `setInterval`/`setTimeout` trong worker là bản host bọc lại |
| Gọi lệnh | `commands.<module>.<tên lệnh>()` |
| `options: [2, 5, 30]` | Đổi thành `{ value, label }` |

- Field tùy chọn cho người cần kiểm soát thêm: `control`, `min`, `max`, `unit`.
- Từ khai báo rút gọn, host dựng Definition đầy đủ rồi đưa qua `guard.js` như cũ, nên whitelist và kiểm tra an toàn vẫn nguyên vẹn.

## G. Command

- Vị trí: `modules/<module>/backend/setting/command/<tên rộng>.js`. Ví dụ `editor/.../command/save.js` gom mọi lệnh liên quan đến lưu
- Tên file không dính vào cách gọi. Phần `<module>` trong `commands.<module>.<lệnh>` lấy từ tên thư mục module.

```js
module.exports = {
  saveAll: {
    label: "Lưu tất cả file đã sửa",
    runIn: "renderer", // model Monaco nằm ở renderer
  },
};
```

- Command được quét qua capability `setting-command`, cùng cách `setting-transform` đang chạy.
- UC12 hiển thị danh sách command dưới dạng dòng gọi sẵn để copy, ví dụ `commands.editor.saveAll()  // Lưu tất cả file đã sửa`.


## I. CSDL (`shared/storage`)

```
~/.vibe/
├─ extensions.json            ← namespace "extensions" (trạng thái ext)
├─ settings.json              ← namespace "settings" (có sẵn, chứa giá trị setting của ext)
└─ extensions/<id>/<entry>    ← code ext (file thật, <entry> lấy từ runtimes/<language>.js, js → index.js)
```

**Namespace `extensions`:** chỉ tầng global, không `expose` cho renderer (renderer đi qua IPC của module).

```js
"auto-save": {            // key = id ext = tên thư mục
  language: "js",
  enabled: false,
  crashes: 0,             // số lần lỗi liên tiếp
  lastError: null,        // { message, at }
  createdAt: 
}
```

- Không lưu `name`, `settings`, code và trạng thái chạy. Những thứ này đọc từ file hoặc suy ra lúc chạy.
- Code lưu ở **file** (không lưu trong storage) vì:
  - mở được trong Monaco bằng `fs:read-file` sẵn có;
  - worker nạp thẳng theo đường dẫn;
  - user tự backup hoặc chia sẻ bằng cách copy thư mục;
  - tránh ghi lại cả file JSON mỗi lần user gõ.
- Giá trị setting của ext nằm trong namespace `settings` có sẵn, theo quy ước id `<extId>.<key>`. Engine chỉ lưu giá trị khác default.

**Quy tắc id**

| Bước | Quy tắc |
|---|---|
| Chuẩn hóa | Chữ thường, ký tự không phải `a-z0-9` đổi thành `-`, bỏ `-` đầu/cuối (cùng hàm `slug` ở `migrate-legacy.js`) |
| Rỗng hoặc bắt đầu bằng số | Thêm tiền tố `ext-` |
| Trùng id hoặc trùng owner có sẵn | Thêm hậu tố `-2`, `-3` (không dùng `(1)` vì sai `OWNER_PATTERN`) |
| Sau khi tạo | **Bất biến.** Đổi `name` trong code chỉ đổi nhãn hiển thị |

**Ràng buộc khác**

- `id` phải khớp `OWNER_PATTERN` (`^[a-z][a-z0-9-]*$`) và không thuộc owner đã có (`appearance`, `syntax`, `editor`, `terminal` và mọi `activeModules`).
- `language` phải có trong `runtimes/`.
- `crashes` chạm ngưỡng N (đề xuất 3) thì `enabled=false` và ghi `lastError`.
- `crashes` reset về 0 khi user bật lại hoặc lưu code mới.
- Đồng bộ: thư mục không có record thì tự tạo record với `enabled: false`. Record không có thư mục thì xóa record.

**Ánh xạ UC → thao tác storage**

| UC | Thao tác |
|---|---|
| UC1 | `entries()` kết hợp quét thư mục `extensions/` |
| UC2 | `set({ key: id, value: { language, enabled: false, crashes: 0, lastError: null, createdAt } })` và tạo file rỗng |
| UC3 | Ghi file, rồi `set` với `crashes: 0` và `lastError` theo kết quả nạp |
| UC4 | `set` với `enabled` đổi |
| UC5 | `delete({ key: id })`, xóa thư mục, xóa mọi key `<id>.*` trong `settings` |
| UC10 | `set` với `crashes + 1` và `lastError`, tự tắt khi chạm ngưỡng |

## J. Việc chạm ngoài `modules/extension`

- `modules/settings` cần thêm field `control?` vào spec/validate và nhánh hiển thị ở `value-input.template.js` (nhỏ, nhưng ngoài module ext).
- `settings/backend/sources/extensions-dir.js` đang không được `sources/index.js` dùng và trùng vai trò với nguồn mới. Đề xuất xóa khi làm xong.
- Ext cung cấp nguồn setting qua capability `setting-source` (cần có `onDidChange` để engine `reload()`).

modules/extension/backend/
├─ index.js
├─ compose.js                         ★
├─ domain/
│  ├─ extension.js · ext-id.js · crash-policy.js · expand-settings.js
│  └─ catalog.js                      ★
├─ usecases/
│  ├─ index.js · need-record.js ★ · lifecycle.js ★
│  ├─ list-extensions.js · list-languages.js · list-commands.js
│  ├─ create-extension.js · save-code.js · set-enabled.js · remove-extension.js
│  ├─ on-setting-changed.js · on-code-changed.js ★ · handle-crash.js · sync-extensions.js
├─ ports/
│  └─ repository · code-store · runner · command-bus · settings-gateway (.port.js)
├─ adapters/
│  ├─ storage/extension-repo.js
│  ├─ files/code-store.js · code-watcher.js ★
│  ├─ runtimes/index.js · js/js.js · js/worker.js
│  ├─ worker/worker-runner.js · sandbox-api.js · messages.js
│  ├─ commands/scan-commands.js · command-bus.js
│  └─ settings/setting-source.js · setting-values.js
└─ interface/ipc.js · presenter.js · broadcast.jsmodules/extension/backend/
├─ index.js
├─ compose.js                         ★
├─ domain/
│  ├─ extension.js · ext-id.js · crash-policy.js · expand-settings.js
│  └─ catalog.js                      ★
├─ usecases/
│  ├─ index.js · need-record.js ★ · lifecycle.js ★
│  ├─ list-extensions.js · list-languages.js · list-commands.js
│  ├─ create-extension.js · save-code.js · set-enabled.js · remove-extension.js
│  ├─ on-setting-changed.js · on-code-changed.js ★ · handle-crash.js · sync-extensions.js
├─ ports/
│  └─ repository · code-store · runner · command-bus · settings-gateway (.port.js)
├─ adapters/
│  ├─ storage/extension-repo.js
│  ├─ files/code-store.js · code-watcher.js ★
│  ├─ runtimes/index.js · js/js.js · js/worker.js
│  ├─ worker/worker-runner.js · sandbox-api.js · messages.js
│  ├─ commands/scan-commands.js · command-bus.js
│  └─ settings/setting-source.js · setting-values.js
└─ interface/ipc.js · presenter.js · broadcast.js