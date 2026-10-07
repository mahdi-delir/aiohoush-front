export function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632));
}

export function normalizePhoneInput(value: string) {
  return normalizeDigits(value).replace(/[\s()\-]/g, "");
}

export function hasPhoneCharacters(value: string) {
  return /^\+?[0-9]+$/.test(value);
}

export function hasCodeCharacters(value: string) {
  return /^[0-9]+$/.test(value);
}
