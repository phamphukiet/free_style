// role-map.js
// 1 vai trò màu → tên field bên Monaco VÀ bên xterm. Nơi DUY NHẤT định nghĩa ánh xạ này.
module.exports = {
  background: { terminal: "background" },
  foreground: { terminal: "foreground" },
  cursor: { terminal: "cursor" },
  comment: { monaco: "comment", terminal: "brightBlack" },
  string: { monaco: "string", terminal: "green" },
  number: { monaco: "number", terminal: "yellow" },
  keyword: { monaco: "keyword", terminal: "blue" },
  identifier: { monaco: "identifier", terminal: "cyan" },
  type: { monaco: "type", terminal: "magenta" },
  delimiter: { monaco: "delimiter" },
  regexp: { monaco: "regexp", terminal: "red" },
};