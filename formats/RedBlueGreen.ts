import { ColorError } from "@/errors/ColorError";
import { defaultAlpha } from "@/helpers/DefaultAlpha";
import { round } from "@/helpers/Round";

/**
 * @property
 *  `red` - The amount red in the Color
 *    - min: 0
 *    - max: 255
 *
 * @property
 *  `green` - The amount green in the Color
 *    - min: 0
 *    - max: 255
 *
 * @property
 *  `blue` - The amount blue in the Color
 *    - min: 0
 *    - max: 255
 *
 * @property
 *  `alpha` - The opacity of the Color
 *    - min: 0.00
 *    - max: 1.00
 */
type RedGreenBlueAlpha = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

const RGB_HEX = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:,\s*([0-1](?:\.\d+)?))?\s*\)$/;

/** @throws ColorError */
const validateRgb = (red: number, green: number, blue: number, alpha?: number) => {
  const colorString = alpha ? `rgba(${red}, ${green}, ${blue}, ${alpha})` : `rgb(${red}, ${green}, ${blue})`;
  const colors = [red, green, blue];

  for (const color of colors) {
    if (isNaN(color) || color < 0 || color > 255) {
      throw ColorError.InvalidRGBCode(colorString);
    }
  }

  if (alpha && (isNaN(alpha) || alpha < 0 || alpha > 1)) {
    throw ColorError.InvalidRGBCode(colorString);
  }

  return {
    red: Math.round(red),
    green: Math.round(green),
    blue: Math.round(blue),
    alpha: defaultAlpha(alpha),
  };
};

/** @throws ColorError */
const parseRgb = (color: string) => {
  const extractedColors = color.match(RGB_HEX);
  if (!extractedColors) throw ColorError.InvalidRGBCode(color);

  const [_, ...colors] = extractedColors.map((color) => (!isNaN(Number(color)) ? Number(color) : undefined));
  const [red, green, blue, alpha] = colors as [number, number, number, number | undefined];

  return validateRgb(red, green, blue, alpha);
};

const rgbToHex = (red: number, green: number, blue: number, alpha?: number) => {
  // Validate and override red, blue, green, and alpha
  const rgb = validateRgb(red, green, blue, alpha);

  red = rgb.red;
  green = rgb.green;
  blue = rgb.blue;
  alpha = rgb.alpha;

  // Convert to hexadecimal
  const colors = [red, green, blue, Math.round(alpha * 255)]
    .map((color) => color.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  return `#${colors}`;
};

/** @throws ColorError */
const rgbToHsl = (red: number, green: number, blue: number, alpha?: number) => {
  // Validate and override red, blue, green, and alpha
  const rgb = validateRgb(red, green, blue, alpha);

  red = rgb.red;
  green = rgb.green;
  blue = rgb.blue;
  alpha = rgb.alpha;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const average = (max + min) / 2;

  const lightness = round(average / 255, 2);
  const saturation = (() => {
    if (delta === 0) return 0; // Achromatic
    return round(delta / (1 - Math.abs(lightness * 2 - 1)) / 255, 2);
  })();

  let hue = (() => {
    if (delta === 0) return 0; // Achromatic, all colors are the same value
    if (max === red) return ((green - blue) / delta) % 6;
    if (max === green) return (blue - red) / (max - min) + 2;
    return (red - green) / (max - min) + 4;
  })();

  hue = Math.round(hue * 60);
  hue = hue < 0 ? hue + 360 : hue;

  return { hue, saturation, lightness, alpha };
};

export { parseRgb, rgbToHex, rgbToHsl, validateRgb };
export type { RedGreenBlueAlpha };
