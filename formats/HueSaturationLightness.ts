import { ColorError } from "@/errors/ColorError";
import { defaultAlpha } from "@/helpers/DefaultAlpha";
import { round } from "@/helpers/Round";

/**
 * @property
 *  `hue` - The color represented on the color wheel
 *    - min: 0
 *    - max: 259
 *
 * @property
 *  `saturation` - How close the Color is to gray
 *    - min: 0.00
 *    - max: 1.00
 *
 * @property
 *  `lightness` - The close the color is to white or black
 *    - min: 0.00
 *    - max: 1.00
 *
 * @property
 *  `alpha` - The opacity of the Color
 *    - min: 0.00
 *    - max: 1.00
 */
type HueSaturationLightnessAlpha = {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
};

const HSL_REGEX = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%(?:,\s*([0-1](?:\.\d+)?))?\s*\)$/;

const validateHsl = (hue: number, saturation: number, lightness: number, alpha?: number) => {
  const colorString = alpha
    ? `hsla(${hue}, ${saturation * 100}%, ${lightness * 100}%, ${alpha})`
    : `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`;

  if (isNaN(hue) || hue < 0 || hue >= 360) throw ColorError.InvalidHSLCode(colorString);
  if (isNaN(saturation) || saturation < 0 || saturation > 1) throw ColorError.InvalidHSLCode(colorString);
  if (isNaN(lightness) || lightness < 0 || lightness > 1) throw ColorError.InvalidHSLCode(colorString);
  if (alpha && (isNaN(alpha) || alpha < 0 || alpha > 1)) throw ColorError.InvalidHSLCode(colorString);

  return {
    hue: round(hue),
    saturation: round(saturation, 2),
    lightness: round(lightness, 2),
    alpha: defaultAlpha(alpha),
  };
};

const parseHsl = (color: string) => {
  const extractedColors = color.match(HSL_REGEX);
  if (!extractedColors) throw ColorError.InvalidHSLCode(color);

  const [_, ...colors] = extractedColors.map((color) => (!isNaN(Number(color)) ? Number(color) : undefined));
  const [hue, saturation, lightness, alpha] = colors as [number, number, number, number | undefined];

  return validateHsl(hue, saturation / 100, lightness / 100, alpha);
};

const hslToRgb = (hue: number, saturation: number, lightness: number, alpha?: number) => {
  // Validate and override red, blue, green, and alpha
  const hsl = validateHsl(hue, saturation, lightness, alpha);

  hue = hsl.hue;
  saturation = hsl.saturation;
  lightness = hsl.lightness;
  alpha = hsl.alpha;

  // Calculate chroma using the formula: C = (1 - |2L - 1|) * S
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const huePrime = hue / 60;
  const position = chroma * (1 - Math.abs((huePrime % 2) - 1));
  const lightnessPrime = lightness - chroma / 2;

  const huePrimeToRGB = (huePrime: number, chroma: number, position: number): [number, number, number] => {
    if (huePrime < 1) return [chroma, position, 0];
    if (huePrime < 2) return [position, chroma, 0];
    if (huePrime < 3) return [0, chroma, position];
    if (huePrime < 4) return [0, position, chroma];
    if (huePrime < 5) return [position, 0, chroma];
    return [chroma, 0, position];
  };

  const [redPrime, greenPrime, bluePrime] = huePrimeToRGB(huePrime, chroma, position);

  const red = round((redPrime + lightnessPrime) * 255);
  const green = round((greenPrime + lightnessPrime) * 255);
  const blue = round((bluePrime + lightnessPrime) * 255);

  return { red, green, blue, alpha };
};

export { hslToRgb, parseHsl, validateHsl };
export type { HueSaturationLightnessAlpha };
