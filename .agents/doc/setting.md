# Thiết kế lại Settings

> Trạng thái: đề xuất. Chưa có code.
> Phạm vi: `modules/settings`, phần `setting/` của các module khác, `shared/setting-*`.

## 1. Mục tiêu

- Một định dạng khai báo duy nhất cho setting của module (built-in), extension và custom của user/AI.
- Setting của editor và các module khác chỉ tồn tại ở backend. Frontend không biết id setting nào.
- UX/UI đọc backend, không phải code lại frontend mỗi lần thêm hoặc sửa setting.
- Có đường kết nối với setting bên ngoài (file ngoài, VS Code).
- Chừa chỗ cho extension do người dùng tạo và chia sẻ (chưa làm).

## 2. Vấn đề của thiết kế cũ

- `loader.loadAll()` đọc lại cả file JSON cho từng setting và `require` lại toàn bộ file root ở mỗi lần gọi.
- `store.js` ghi `userData/settings-store.json`, trùng chức năng với `shared/storage` (global/workspace, ghi atomic, backup).
- Hai kênh thông báo thay đổi: `settings:changed` và `storage:changed`.
- Module khác không đóng góp được vì `loader` chỉ quét `source/root`.
- Dữ liệu nằm hai nơi: bảng màu syntax có trong `syntax.js` và lặp lại trong `syntax-apply.js`.
- Giá trị theme có hai dạng (id hoặc chuỗi JSON), nên `apply` phải đoán dạng.
- Frontend phải đọc `editor.*` và tự áp lên Monaco (`loadFontSettings`), nên mỗi setting mới là một lần sửa frontend.
- `theme-apply.js`, `syntax-apply.js`, `ai-bridge.js` vượt 100 dòng.
- `handleAddPreset` dùng `window.prompt` (Electron không hỗ trợ).
- `getToolSpec()` nhét toàn bộ giá trị hiện tại vào `description`, nên spec to dần và dễ cũ.

## 3. Mượn gì từ VS Code

| Mượn | Áp dụng |
|---|---|
| Registry nhận schema từ nhiều nơi, chặn id trùng | `core/registry.js`, `core/validate.js` |
| Phân tầng default < user < workspace | `core/resolver.js` |
| `inspect()` trả giá trị từng tầng | UI hiện "đã sửa ở workspace", nút reset |
| Ghi giá trị bằng default thì xóa key | `core/values.js` |
| `affectsConfiguration(prefix)` | `core/events.js`, `watch({ prefix })` |
| `scope` (application / window) | `scope: "global" \| "any"` |
| `policy` / `restricted` | `aiAccess: "write" \| "read" \| "none"` |
| Setting khai báo bằng `package.json` tĩnh | Manifest thuần dữ liệu |
| `configurationDefaults` | Preset / override default |
| `order`, `tags`, `included:false` | `order`, `tags` trong definition |

**Không mượn** (YAGNI): policy service, remote/multi-root, override theo `[ngôn ngữ]`, experiment, agentHost sync, biến `${}`, ConfigurationEditing.

## 4. Phân loại setting

Module trong repo chính là extension built-in. Cùng một định dạng manifest, chỉ khác nơi nạp và mức tin cậy.

| Loại | Ai tạo | Manifest ở đâu | Mức tin cậy |
|---|---|---|---|
| **Module (built-in)** | Kỹ sư, trong repo | `modules/<id>/backend/setting/manifest.js` | Cao. Trùng id thì thắng |
| **Extension** | Người dùng / chia sẻ | `~/.vibe/extensions/<id>/manifest.json` hoặc `<project>/.vibe/extensions/` | Thấp. Qua guard và whitelist target |
| **Custom** | User/AI lúc chạy | Sinh thành extension cục bộ qua `extensions/create.js` | Như extension |

Quy ước chung:
- Id bắt buộc có prefix `owner.` để tránh đụng nhau.
- Extension chỉ chứa dữ liệu, không chứa code. Cần logic thì làm module đầy đủ.
- Lỗi manifest: không kích hoạt, trả lỗi cho UI/toast.
- Module hoặc extension bị gỡ: definition biến mất, giá trị đã lưu vẫn giữ (orphan), bật lại thì khôi phục.
- `origin` do hệ thống gán, contributor không tự khai.

## 5. Hợp đồng Definition (mô tả)

**Bắt buộc:** `id` (`owner.key`), `group`, `label`, `type` (`boolean | number | string | select`), `default`.

**Tùy chọn:**
- `scope`: `"global"` (chỉ ghi ở `~/.vibe`) hoặc `"any"` (mặc định, workspace được ghi đè).
- `order`, `description`, `tags`, `deprecated`.
- `min` / `max` cho number.
- `aiAccess`: `write` (mặc định), `read`, `none`.
- `options` cho select: mỗi option gồm `value`, `label`, `data` (dữ liệu nặng như palette).
- `effects`: danh sách `{ target, payload }` mô tả giá trị này tác động lên đâu (mục 6).

**Giá trị lưu luôn gọn:** chỉ là id của option, không bao giờ là chuỗi JSON. Preset do user/AI thêm có cùng hình dạng `{value, label, data}` với preset built-in, nên `apply` không cần phân biệt.

## 6. Mô hình Effects

- Mỗi setting khai báo `effects` ở backend, ví dụ `target: "monaco.options"`, `"css.vars"`, `"monaco.theme"`, `"terminal.theme"`.
- Backend (`core/effects.js`) tính ra effect đã resolve (gồm cả `option.data`) rồi đẩy xuống renderer.
- Frontend chỉ viết **một handler cho mỗi target** (`registerEffectHandler(target, fn)`), không biết id setting.
- `payload` là biểu thức **dữ liệu**, không phải code, ví dụ `$value` hoặc `$option.data.vars`. Nhờ vậy extension an toàn.
- Whitelist target trong `manifest/targets.js`. Extension chỉ được dùng target trong danh sách.
- Khi renderer khởi động, backend gửi một lần "toàn bộ effect hiện tại" để áp dụng giá trị đã lưu.

## 7. Cây thư mục

```
shared/
├─ setting-client.js            # (renderer) get/watch/set qua IPC; trả fallback khi module settings vắng
└─ setting-effect.js            # (renderer) registerEffectHandler(target, fn) + nhận "effects" từ backend và gọi handler

modules/settings/
├─ backend/
│  ├─ index.js                  # register(): dựng engine, nối IPC/service/tool. Không chứa logic
│  ├─ core/                     # engine thuần Node, nhận deps qua tham số (test được)
│  │  ├─ registry.js            # gom definition từ mọi source; id trùng → module thắng, extension bị từ chối
│  │  ├─ validate.js            # kiểm tra manifest/definition và giá trị theo type/enum/min/max
│  │  ├─ resolver.js            # default < global < workspace; inspect() trả từng tầng
│  │  ├─ values.js              # đọc/ghi namespace "settings" trên shared/storage; value == default thì xóa key
│  │  ├─ effects.js             # (id, value) → danh sách effect đã resolve (gồm option.data)
│  │  ├─ events.js              # diff giá trị hiệu lực → phát {ids, effects}; đổi project cũng phát
│  │  └─ migrate-legacy.js      # chạy 1 lần: userData/settings-store.json → storage mới
│  ├─ manifest/                 # hợp đồng manifest dùng chung cho module và extension
│  │  ├─ spec.js                # hình dạng: id, version, owner, settings[], presets[], palettes[]
│  │  ├─ targets.js             # whitelist effect target extension được dùng
│  │  └─ guard.js               # chặn manifest lỗi: không kích hoạt, trả lỗi cho UI/toast
│  ├─ sources/                  # nơi manifest đến từ đâu; mỗi source một file, cùng giao diện list()/watch()
│  │  ├─ index.js               # gom tất cả source; thêm source = thêm 1 dòng
│  │  ├─ modules.js             # quét modules/<id>/backend/setting/manifest.js theo active-modules.js
│  │  ├─ extensions-dir.js      # quét ~/.vibe/extensions/* và <project>/.vibe/extensions/*
│  │  └─ remote.js              # (chừa chỗ) tải extension từ URL/registry khi chia sẻ
│  ├─ extensions/               # vòng đời extension của người dùng
│  │  ├─ installed.js           # danh sách đã cài, bật/tắt, phiên bản (namespace "extensions")
│  │  ├─ install.js             # cài từ thư mục/zip/URL: kiểm tra manifest rồi chép vào ~/.vibe/extensions
│  │  ├─ export.js              # đóng gói preset/setting của user thành extension để chia sẻ
│  │  └─ create.js              # UI/AI tạo extension mới (sinh manifest.json dạng dữ liệu)
│  ├─ connectors/               # kết nối giá trị với setting bên ngoài
│  │  ├─ index.js               # đăng ký connector, chọn theo cấu hình
│  │  └─  file-link.js           # liên kết một file JSON ngoài, theo dõi hai chiều
│  ├─ api/
│  │  ├─ commands.js            # nghiệp vụ: list, get, getAll, inspect, set, reset, addPreset, các lệnh extension
│  │  ├─ ipc.js                 # settings:* → commands, trả {ok, error}
│  │  ├─ broadcast.js           # đẩy settings:changed kèm effects tới mọi window
│  │  └─ service.js             # capability "settings" (chỉ đọc) cho module main khác
│  ├─ ai/
│  │  └─ tool.js                # tool "settings" (spec tĩnh, execute theo aiAccess); xóa/sửa cần confirmed
│  └─ setting/                  # setting do chính module settings sở hữu (workbench-level)
│     ├─ manifest.js            # gom các nhóm bên dưới
│     └─ appearance/
│        ├─ theme.js            # schema: type select, effects → css.vars + monaco.theme
│        ├─ syntax.js           # schema: effects → monaco.theme + terminal.theme
│        └─ palettes/           # dark/light/monokai, classic/pastel/vivid (dữ liệu thuần, 1 nguồn duy nhất)
│
└─ frontend/
   ├─ index.js                  # registry: activitybar, sidebar view, empty editor view
   ├─ state/selection.js        # group/scope/query sống qua remount, bắn CustomEvent
   ├─ st-sidebar/               # (3 file) danh sách group + tìm kiếm
   ├─ st-editor-group/          # (3 file + dashboard/detail template) điều phối dashboard ↔ detail ↔ extensions
   ├─ st-row/                   # (3 file) một dòng setting: label, id, chấm "đã sửa", control, reset
   ├─ st-controls/              # registry control theo type; mỗi type một file (boolean, number, string, select)
   ├─ st-form/                  # (3 file) thêm preset, tạo extension (thay window.prompt)
   ├─ st-extensions/            # (3 file) danh sách extension: cài, bật/tắt, xuất, nhập
   └─ effects/                  # handler cho effect workbench-level, viết một lần
      ├─ index.js               # glob các file bên dưới
      ├─ css-vars.js            # target "css.vars" → set biến lên :root
      └─ monaco-theme.js        # target "monaco.theme" → gọi shared/monaco-theme.js

modules/editor/
├─ backend/
│  ├─ index.js                  # thêm 1 dòng: expose thư mục setting cho source "modules"
│  └─ setting/                  # TOÀN BỘ setting editor chỉ nằm ở đây
│     ├─ manifest.js            # owner "editor", gom các file bên dưới
│     ├─ font.js                # editor.fontSize, editor.fontFamily (≤100 dòng)
│     ├─ indent.js              # editor.tabSize
│     └─ behavior.js            # wordWrap, minimap, ... mỗi setting khai báo effect → monaco.options
└─ frontend/
   └─ effects.js                # 1 lần: registerEffectHandler("monaco.options", ...) → instance.updateOptions
                                # (xóa loadFontSettings và đọc "editor.*" trong editor.js)

modules/terminal/
├─ backend/setting/manifest.js  # setting terminal tự khai báo
└─ frontend/effects.js          # handler "terminal.theme" (nghe qua shared/terminal-theme.js)

~/.vibe/extensions/<ext-id>/    # extension của người dùng (chia sẻ nguyên thư mục)
├─ manifest.json                # id, version, settings[], presets[], palettes[] (không chứa code)
└─ assets/                      # (tùy chọn) ảnh, icon, dữ liệu kèm theo
```

## 8. Dữ liệu lưu

| Nơi | Nội dung |
|---|---|
| `~/.vibe/settings.json` | Giá trị global (chỉ giá trị khác default) |
| `<project>/.vibe/settings.json` | Giá trị workspace (chỉ setting `scope: "any"`) |
| `~/.vibe/settings-presets.json` | Preset do user/AI thêm |
| `~/.vibe/extensions.json` | Danh sách extension đã cài, trạng thái bật/tắt, phiên bản |
| `~/.vibe/extensions/<id>/` | File extension |

Các namespace này không `expose` cho renderer. Mọi truy cập đi qua `settings:*` để được validate.

**Hằng số như palette theme:** giữ built-in trong code (`setting/appearance/palettes/`), không chép vào storage.
- Read-only và có version, nâng cấp app thì palette được cập nhật theo.
- Reset dễ: xóa key là về default.
- Storage chỉ giữ dữ liệu của user: id đang chọn, preset, override.
- Lúc chạy gộp `options = built-in + preset`, hai loại có cùng hình dạng.
- Chỉ ghi ra storage khi user "fork" một theme built-in, lúc đó nó thành preset có id riêng.
- Cách này gần với VS Code: schema và default nằm trong code, dữ liệu theme nằm trong extension, `workbench.colorTheme` chỉ lưu tên.

## 9. Luồng chính

- **Đọc:** `sources/*` → `core/registry` (validate, dedupe) → `core/resolver` (gộp tầng) → `core/effects` (tính effect).
- **Ghi:** UI gọi `settings:set` → validate → `values` ghi storage → `events` diff → `broadcast` gửi `{ids, effects}` → `shared/setting-effect.js` gọi đúng handler theo `target`.
- **Khởi động renderer:** nhận một lần toàn bộ effect hiện tại.
- **Mở project khác:** layered storage tự phát thay đổi, theme/font theo workspace tự cập nhật.
- **Thêm setting cho editor:** chỉ thêm file trong `modules/editor/backend/setting/`, không sửa frontend.
- **Thêm target mới:** thêm tên vào `manifest/targets.js` và một `effects/*.js` ở frontend của module sở hữu target.
- **Chia sẻ extension:** `export.js` đóng gói thư mục có `manifest.json`. `install.js` kiểm tra bằng `manifest/guard.js` và chỉ cho dùng target trong whitelist.
- **Kết nối ngoài:** connector đọc/ghi qua `commands.set`, nên vẫn qua validate và events. Nhập từ VS Code chỉ nhận key có trong `vscode-map.js`.
- **Settings bị gỡ:** module khác không lỗi vì dùng `getService({ id: "settings", fallback })`. `setting-client` trả fallback.

## 10. Đối chiếu rule.md

- **≤100 dòng, complexity thấp:** mỗi file một trách nhiệm. Ba file đang vượt (`theme-apply`, `syntax-apply`, `ai-bridge`) được tách và dữ liệu màu chuyển sang `palettes/`.
- **Xóa không ảnh hưởng tổng thể:** gỡ settings, một module, `extensions/` hay `connectors/` đều độc lập.
- **Registry và CustomEvent:** module không gọi trực tiếp nhau, chỉ qua `capability-registry` và event.
- **Object hóa chữ ký:** `set({id, value, scope})`, `watch({id|prefix, apply})`, `registerEffectHandler({target, handler})`. Đổi chữ ký `window.api.settings.set` nên cần sửa nơi đang gọi.
- **Lit 3 file:** `st-sidebar`, `st-editor-group`, `st-row`, `st-form`, `st-extensions` đều có `.css`, `.template.js`, `.js`.
- **Preload là cầu nối duy nhất:** cần thêm `inspect`, `reset`, `getEffects`, và các lệnh extension.

**Đề xuất sửa rule.md mức 3:** dòng nói về `xxx-apply.js` trong `sources/<origin>/<module>/` đổi thành "schema và effect ở `modules/<tên>/backend/setting/`; handler cho effect ở `modules/<tên>/frontend/effects.js`".

## 11. Thứ tự triển khai

1. `shared/setting-client.js` và `shared/setting-effect.js`.
2. `core/` và `manifest/` kèm test `test/07_settings.test.js` (thứ tự tầng, validate, id trùng, effects, migrate).
3. `sources/modules.js`, `api/`, cập nhật preload (giữ tạm tên cũ để UI cũ còn chạy).
4. Chuyển theme và syntax sang `setting/appearance/` và gộp dữ liệu vào `option.data`.
5. Chuyển `editor.*` sang `modules/editor/backend/setting/`, thay `loadFontSettings` bằng handler `monaco.options`.
6. UI mới: `st-row`, `st-controls`, `st-form`, tìm kiếm.
7. `connectors/` (vscode-import, file-link).
8. `extensions/` và `sources/extensions-dir.js`, tool AI mới.
9. Xóa `source/root`, `loader.js`, `store.js`, `notify.js`, `ai-bridge.js`, `apply-loader.js`.

## 12. Điểm cần chốt

- **Biểu thức effect:** cần quy ước tối thiểu (`$value`, `$option.data.*`). Phải là dữ liệu, không phải code.
- **Extension cần logic riêng:** làm cơ chế module đầy đủ, không nhét vào manifest.
- **Extension trong workspace:** `<project>/.vibe/extensions` có thể bị commit theo project. Cần quyết định tin tự động hay hỏi người dùng trước khi bật.
- **Đánh số thư mục** (`001_theme`): thay bằng trường `order`. Giữ số cũ thì đặt `order` bằng số đó.
- **Module chưa xem:** `modules/registry.js` (`registerConfigConsumer`), `terminal-manager`, module chat, các setting root còn lại. Cần kiểm tra chúng chỉ dùng `window.api.settings.*` trước khi đổi chữ ký.