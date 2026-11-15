// pages.js
// Trách nhiệm duy nhất: đọc "trang settings" do module khác đăng ký qua registry.
// Registry chưa hỗ trợ (hoặc chưa module nào đăng ký) → trả rỗng, không ném lỗi.

import { registry } from "@modules/registry.js";

export const listPages = () => registry.getSettingsPages?.() ?? [];

export const getPage = ({ id }) => registry.getSettingsPage?.(id) ?? null;

export const onPagesChanged = (listener) =>
  registry.on("settings-pages:changed", listener);