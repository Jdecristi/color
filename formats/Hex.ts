import { ColorError } from "@/errors/ColorError";
import { round } from "@/helpers/Round";

const HEX_REGEX = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;

const stringToDecimals = (string: string) => parseInt(string, 16);

const parseHex = (string: string) => {
  if (!HEX_REGEX.test(string)) throw ColorError.InvalidHexCode(string);

  // Check if the string is a shorthand hex code
  if (string.length === 4) {
    const red = `${string[1]}${string[1]}`;
    const green = `${string[2]}${string[2]}`;
    const blue = `${string[3]}${string[3]}`;
    const alpha = string[4] ? `${string[4]}${string[4]}` : "FF";

    return `#${red}${green}${blue}${alpha}`.toUpperCase();
  }

  // Append default alpha channel if not present
  if (string.length === 7) {
    return `${string}FF`.toUpperCase();
  }

  return string.toUpperCase();
};

const hexToRgb = (string: string) => {
  const hex = parseHex(string);

  return {
    red: stringToDecimals(`${hex[1]}${hex[2]}`),
    green: stringToDecimals(`${hex[3]}${hex[4]}`),
    blue: stringToDecimals(`${hex[5]}${hex[6]}`),
    alpha: round(stringToDecimals(`${hex[7]}${hex[8]}`) / 255, 2),
  };
};

export { hexToRgb, parseHex };
