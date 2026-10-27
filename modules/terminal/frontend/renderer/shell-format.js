const psq = (s) =>
  `'${s.replace(/['\u2018\u2019\u201A\u201B]/g, (m) => m + m)}'`; // PowerShell coi cả nháy cong là nháy đơn

export const FORMAT = {
  powershell: (exe, args) => `& ${[exe, ...args].map(psq).join(" ")}`,
  cmd: (exe, args) => [exe, ...args].map((s) => `"${s}"`).join(" "),
};