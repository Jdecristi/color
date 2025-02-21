import { describe, expect, test } from "bun:test";

import { ColorError } from "@/errors/ColorError";
import { hslToRgb, parseHsl } from "@/formats/HueSaturationLightness";

import type { HueSaturationLightnessAlpha } from "@/formats/HueSaturationLightness";
import type { RedGreenBlueAlpha } from "@/formats/RedBlueGreen";

describe("parseHsl", () => {
  describe("should throw if invalid HSL code", () => {
    test("hsl mispelled as hls", () => {
      const color = "hls(0, 0, 0)";
      const errorMessage = ColorError.InvalidColor(color).message;

      expect(() => parseHsl(color)).toThrow(errorMessage);
    });

    test("hsl contains non-numeric values", () => {
      const color = "hsl(x, 0, 0)";
      const errorMessage = ColorError.InvalidHSLCode(color).message;

      expect(() => parseHsl(color)).toThrow(errorMessage);
    });

    test("hsl contains negative values", () => {
      const color = "hsl(-1, 0, 0)";
      const errorMessage = ColorError.InvalidHSLCode(color).message;

      expect(() => parseHsl(color)).toThrow(errorMessage);
    });

    test("hsl contains values out of bounds", () => {
      const color = "hsl(360, 0, 0)";
      const errorMessage = ColorError.InvalidHSLCode(color).message;

      expect(() => parseHsl(color)).toThrow(errorMessage);
    });

    test("hsla contains alpha out of bounds", () => {
      const color = "hsl(255, 0, 0, 2)";
      const errorMessage = ColorError.InvalidHSLCode(color).message;

      expect(() => parseHsl(color)).toThrow(errorMessage);
    });
  });

  describe("should return correct hue, saturation, lightness, & alpha values", () => {
    test("should auto fill alpha", () => {
      const color = "hsl(0, 0%, 0%)";
      const expected: HueSaturationLightnessAlpha = { hue: 0, saturation: 0, lightness: 0, alpha: 1 };

      expect(parseHsl(color)).toEqual(expected);
    });

    test("valid hsla", () => {
      const color = "hsla(0, 100%, 100%, 0.5)";
      const expected: HueSaturationLightnessAlpha = { hue: 0, saturation: 1, lightness: 1, alpha: 0.5 };

      expect(parseHsl(color)).toEqual(expected);
    });
  });
});

describe("hslToRgb", () => {
  describe("should throw if invalid HSL values", () => {
    test("hsl contains negative values", () => {
      const hue = -1;
      const saturation = 0;
      const lightness = 0;
      const colorString = `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`;
      const errorMessage = ColorError.InvalidHSLCode(colorString).message;

      expect(() => hslToRgb(hue, saturation, lightness)).toThrow(errorMessage);
    });

    test("hsl contains hue out of bounds", () => {
      const hue = 360;
      const saturation = 0;
      const lightness = 0;
      const colorString = `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`;
      const errorMessage = ColorError.InvalidHSLCode(colorString).message;

      expect(() => hslToRgb(hue, saturation, lightness)).toThrow(errorMessage);
    });

    test("hsl contains saturation out of bounds", () => {
      const hue = 0;
      const saturation = 1.1;
      const lightness = 0;
      const colorString = `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`;
      const errorMessage = ColorError.InvalidHSLCode(colorString).message;

      expect(() => hslToRgb(hue, saturation, lightness)).toThrow(errorMessage);
    });

    test("hsl contains lightness out of bounds", () => {
      const hue = 0;
      const saturation = 0;
      const lightness = 1.1;
      const colorString = `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`;
      const errorMessage = ColorError.InvalidHSLCode(colorString).message;

      expect(() => hslToRgb(hue, saturation, lightness)).toThrow(errorMessage);
    });

    test("hsla contains alpha out of bounds", () => {
      const hue = 0;
      const saturation = 0;
      const lightness = 0;
      const alpha = 1.1;
      const colorString = `hsla(${hue}, ${saturation * 100}%, ${lightness * 100}%, ${alpha})`;
      const errorMessage = ColorError.InvalidHSLCode(colorString).message;

      expect(() => hslToRgb(hue, saturation, lightness, alpha)).toThrow(errorMessage);
    });
  });

  describe("should return correct red, green, blue & alpha values", () => {
    test("should auto fill alpha", () => {
      const hue = 0;
      const saturation = 0;
      const lightness = 0;
      const expected: RedGreenBlueAlpha = { red: 0, green: 0, blue: 0, alpha: 1 };

      expect(hslToRgb(hue, saturation, lightness)).toEqual(expected);
    });

    test("valid hsla", () => {
      const hue = 0;
      const saturation = 0;
      const lightness = 1;
      const alpha = 0.5;
      const expected: RedGreenBlueAlpha = { red: 255, green: 255, blue: 255, alpha: 0.5 };

      expect(hslToRgb(hue, saturation, lightness, alpha)).toEqual(expected);
    });
  });
});
