import { ColorError } from "@/errors/ColorError";
import { hexToRgb, parseHex } from "@/formats/Hex";
import { hslToRgb, parseHsl, validateHsl } from "@/formats/HueSaturationLightness";
import { parseRgb, rgbToHex, rgbToHsl, validateRgb } from "@/formats/RedGreenBlue";

import type { HueSaturationLightnessAlpha } from "@/formats/HueSaturationLightness";
import type { RedGreenBlueAlpha } from "@/formats/RedGreenBlue";

type ColorAttributes = RedGreenBlueAlpha &
  HueSaturationLightnessAlpha & {
    hexCode: string;
  };

type ColorFormat = "hex" | "rgb" | "hsl";

/**
 * # Color
 *
 * A color defines a specific color ranging from:
 * - white → black,
 * - red → green → blue,
 * - transparent → opaque,
 *
 * Color aims to add all characteristics of a specific color under one interface
 * Color defualts to a hexadecimal string and can be converted from/to rgb and hsl
 *
 * ---
 * &ensp;
 *
 * ## Properties
 *
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
 *
 * &ensp;
 * ---
 *
 * ## Examples
 * ```
 * const white = Color("#fff"); // #FFFFFFFF (infered from short hex)
 * white.red; // 255
 * white.lightness; // 1
 *
 * const yellow = Color("rgba(255, 255, 0, 0.5)") // #FFFF0080
 * white.hue; // 60
 * white.alpha; // 0.5
 * ```
 */
class Color {
  /**
   * # Color.rgb()
   *
   * Creates a color from a Red, Green, and Blue
   * ---
   *
   * ## Parameters
   *
   * @param
   *  `red` - The amount red in the Color
   *    - min: 0
   *    - max: 255
   *
   * @param
   *  `green` - The amount green in the Color
   *    - min: 0
   *    - max: 255
   *
   * @param
   *  `blue` - The amount blue in the Color
   *    - min: 0
   *    - max: 255
   *
   * @param
   *  `alpha` - The opacity of the Color
   *    - min: 0.00
   *    - max: 1.00
   *    - default: 1.00
   *
   * ---
   *
   * ## Returns
   *
   * @returns
   * &ensp;
   * Returns a new instance of `Color`
   *
   * ---
   *
   * ## Expecptions
   *
   * @throws
   * Throws an instance of a `ColorError`
   *  - red, blue, or green are `< 0` or `> 255`
   *  - alhpa is `< 0.00` or `> 1.00`
   *
   * ---
   *
   * ## Examples:
   * ```
   * Color.rgb(0, 0, 0); // #000000FF (Full opacity by default)
   * Color.rgb(255, 255, 255, 0.5); // #FFFFFF80
   * ```
   * &ensp;
   */
  static rgb(red: number, green: number, blue: number, alpha?: number) {
    const rgb = validateRgb(red, green, blue, alpha);
    const attributes = Color.getAttributesFromRgb(rgb);
    const color = Color.white;

    color.setAttributes(attributes);

    return color;
  }

  /**
   * # Color.hsl()
   *
   * Creates a color from a Hue, Saturation, and Lightness.
   *
   * ---
   *
   * ## Parameters
   *
   * @param `hue`
   * The color on the color wheel
   * - Min: 0
   * - Max: 359
   *
   * @param `saturation`
   * The how close to gray the color is
   * - Min: 0
   * - Max: 1
   *
   * @param `lightness`
   * The how dark/light the color is
   * - Min: 0
   * - Max: 1
   *
   * @param `alpha` - The opacity percentage represented as a decimal
   * - min: 0
   * - max: 1
   * - default: 1
   *
   * ---
   *
   * ## Returns & Expecptions
   *
   * @returns
   * &ensp;
   * Returns a new instance of Color
   *
   * @throws
   * Throws an instance of a ColorError
   *
   * &ensp;
   * ---
   *
   * ## Examples:
   *
   * ```
   * Color.hsl(0, 0, 0); // #000000FF (Full opacity by default)
   * Color.hsl(0, 0, 1, 0.5); // #FFFFFF80
   * Color.hsl(60, 1, 0.5, 0.5); // #00FF0080
   * ```
   * &ensp;
   */
  static hsl(hue: number, saturation: number, lightness: number, alpha?: number) {
    const hsl = validateHsl(hue, saturation, lightness, alpha);
    const attributes = Color.getAttributesFromHsl(hsl);
    const color = Color.white;

    color.setAttributes(attributes);

    return color;
  }

  static get white() {
    return new Color("#FFF");
  }

  static get black() {
    return new Color("#000");
  }

  static get transparent() {
    return new Color("#00000000");
  }

  static get red() {
    return new Color("#F00");
  }

  static get orange() {
    return new Color("#FF8000");
  }

  static get yellow() {
    return new Color("#FF0");
  }

  static get green() {
    return new Color("#0F0");
  }

  static get blue() {
    return new Color("#00F");
  }

  static get purple() {
    return new Color("#F0F");
  }

  private static getAttributesFromHex(color: string) {
    const hexCode = parseHex(color);
    const { red, blue, green, alpha } = hexToRgb(hexCode);
    const { hue, saturation, lightness } = rgbToHsl(red, green, blue);

    return { hexCode, red, blue, green, hue, saturation, lightness, alpha };
  }

  private static getAttributesFromRgb(color: RedGreenBlueAlpha) {
    const { red, blue, green, alpha } = color;
    const { hue, saturation, lightness } = rgbToHsl(red, green, blue, alpha);
    const hexCode = rgbToHex(red, green, blue, alpha);

    return { hexCode, red, blue, green, hue, saturation, lightness, alpha };
  }

  private static getAttributesFromHsl(color: HueSaturationLightnessAlpha) {
    const { hue, saturation, lightness, alpha } = color;
    const { red, blue, green } = hslToRgb(hue, saturation, lightness);
    const hexCode = rgbToHex(red, green, blue, alpha);

    return { hexCode, red, blue, green, hue, saturation, lightness, alpha };
  }

  private static getAttributesFromString(color: string) {
    if (color[0] === "#") return this.getAttributesFromHex(color);
    if (color.includes("rgb")) return this.getAttributesFromRgb(parseRgb(color));
    if (color.includes("hsl")) return this.getAttributesFromHsl(parseHsl(color));

    throw ColorError.InvalidColor(color);
  }

  constructor(color: string) {
    const attributes = Color.getAttributesFromString(color);

    this.#hexCode = attributes.hexCode;
    this.#red = attributes.red;
    this.#green = attributes.green;
    this.#blue = attributes.blue;
    this.#hue = attributes.hue;
    this.#saturation = attributes.saturation;
    this.#lightness = attributes.lightness;
    this.#alpha = attributes.alpha;
  }

  #hexCode: string;

  #red: number;
  get red() {
    return this.#red;
  }
  set red(red: number) {
    const rgb = validateRgb(red, this.#green, this.#blue, this.#alpha);
    const attributes = Color.getAttributesFromRgb(rgb);

    this.setAttributes(attributes);
  }

  #green: number;
  get green() {
    return this.#green;
  }
  set green(green) {
    const rgb = validateRgb(this.#red, green, this.#blue, this.#alpha);
    const attributes = Color.getAttributesFromRgb(rgb);

    this.setAttributes(attributes);
  }

  #blue: number;
  get blue() {
    return this.#blue;
  }
  set blue(blue) {
    const rgb = validateRgb(this.#red, this.#green, blue, this.#alpha);
    const attributes = Color.getAttributesFromRgb(rgb);

    this.setAttributes(attributes);
  }

  #hue: number;
  get hue() {
    return this.#hue;
  }
  set hue(hue) {
    const hsl = validateHsl(hue, this.#saturation, this.#lightness, this.#alpha);
    const attributes = Color.getAttributesFromHsl(hsl);

    this.setAttributes(attributes);
  }

  #saturation: number;
  get saturation() {
    return this.#saturation;
  }
  set saturation(saturation) {
    const hsl = validateHsl(this.#hue, saturation, this.#lightness, this.#alpha);
    const attributes = Color.getAttributesFromHsl(hsl);

    this.setAttributes(attributes);
  }

  #lightness: number;
  get lightness() {
    return this.#lightness;
  }
  set lightness(lightness) {
    const hsl = validateHsl(this.#hue, this.#saturation, lightness, this.#alpha);
    const attributes = Color.getAttributesFromHsl(hsl);

    this.setAttributes(attributes);
  }

  #alpha: number;
  get alpha() {
    return this.#alpha;
  }
  set alpha(alpha) {
    const rgb = validateRgb(this.#red, this.#green, this.#blue, alpha);
    const attributes = Color.getAttributesFromRgb(rgb);

    this.setAttributes(attributes);
  }

  private setAttributes(attributes: ColorAttributes) {
    this.#hexCode = attributes.hexCode;
    this.#red = attributes.red;
    this.#green = attributes.green;
    this.#blue = attributes.blue;
    this.#hue = attributes.hue;
    this.#saturation = attributes.saturation;
    this.#lightness = attributes.lightness;
    this.#alpha = attributes.alpha;
  }

  toString(type: ColorFormat = "hex") {
    const map = {
      hex: this.toHex(),
      rgb: this.toRgb(),
      hsl: this.toHsl(),
    };

    return map[type];
  }

  /**
   * # Color.prototype.toHex()
   *
   * Converts the `Color` instance to a Hex code
   */
  toHex() {
    return this.#hexCode;
  }

  /**
   * # Color.prototype.toHex()
   *
   * Converts the `Color` instance to a rgb code
   */
  toRgb() {
    return `rgba(${this.#red}, ${this.#green}, ${this.#blue}, ${this.#alpha})`;
  }

  /**
   * # Color.prototype.toHex()
   *
   * Converts the `Color` instance to a hls code
   */
  toHsl() {
    return `hlsa(${this.#hue}, ${this.#saturation * 100}%, ${this.#lightness * 100}%, ${this.#alpha})`;
  }
}

export { Color };
export type { HueSaturationLightnessAlpha, RedGreenBlueAlpha };
