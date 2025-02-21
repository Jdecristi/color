import { describe, expect, test } from "bun:test";

import { ColorError } from "@/errors/ColorError";
import { parseRgb, rgbToHex, rgbToHsl } from "@/formats/RedGreenBlue";

import type { HueSaturationLightnessAlpha } from "@/formats/HueSaturationLightness";
import type { RedGreenBlueAlpha } from "@/formats/RedGreenBlue";

describe("parseRgb", () => {
  describe("should throw if invalid RGB code", () => {
    test("rgb mispelled as rbg", () => {
      const color = "rbg(0, 0, 0)";
      const errorMessage = ColorError.InvalidColor(color).message;

      expect(() => parseRgb(color)).toThrow(errorMessage);
    });

    test("rgb contains non-numeric values", () => {
      const color = "rgb(x, 0, 0)";
      const errorMessage = ColorError.InvalidRGBCode(color).message;

      expect(() => parseRgb(color)).toThrow(errorMessage);
    });

    test("rgb contains negative values", () => {
      const color = "rgb(-1, 0, 0)";
      const errorMessage = ColorError.InvalidRGBCode(color).message;

      expect(() => parseRgb(color)).toThrow(errorMessage);
    });

    test("rgb contains values out of bounds", () => {
      const color = "rgb(256, 0, 0)";
      const errorMessage = ColorError.InvalidRGBCode(color).message;

      expect(() => parseRgb(color)).toThrow(errorMessage);
    });

    test("rgba contains alpha out of bounds", () => {
      const color = "rgb(255, 0, 0, 2)";
      const errorMessage = ColorError.InvalidRGBCode(color).message;

      expect(() => parseRgb(color)).toThrow(errorMessage);
    });
  });

  describe("should return correct red, green, blue, & alpha values", () => {
    test("should auto fill alpha", () => {
      const color = "rgb(255, 255, 255)";
      const expected: RedGreenBlueAlpha = { red: 255, green: 255, blue: 255, alpha: 1 };

      expect(parseRgb(color)).toEqual(expected);
    });

    describe("valid rgba", () => {
      const color = "rgb(255, 255, 255, 0.5)";
      const expected: RedGreenBlueAlpha = { red: 255, green: 255, blue: 255, alpha: 0.5 };

      expect(parseRgb(color)).toEqual(expected);
    });
  });
});

describe("rgbToHex", () => {
  describe("should throw if invalid RGB values", () => {
    test("RGB contains negative values", () => {
      const red = -1;
      const green = 0;
      const blue = 0;
      const colorString = `rgb(${red}, ${green}, ${blue})`;
      const errorMessage = ColorError.InvalidRGBCode(colorString).message;

      expect(() => rgbToHex(red, green, blue)).toThrow(errorMessage);
    });

    test("rgb contains values out of bounds", () => {
      const red = 256;
      const green = 0;
      const blue = 0;
      const colorString = `rgb(${red}, ${green}, ${blue})`;
      const errorMessage = ColorError.InvalidRGBCode(colorString).message;

      expect(() => rgbToHex(red, green, blue)).toThrow(errorMessage);
    });

    test("rgba contains alpha out of bounds", () => {
      const red = 0;
      const green = 0;
      const blue = 0;
      const alpha = 2;
      const colorString = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
      const errorMessage = ColorError.InvalidRGBCode(colorString).message;

      expect(() => rgbToHex(red, green, blue, alpha)).toThrow(errorMessage);
    });
  });

  describe("should return the correct hex code", () => {
    test("valid red, blue, green, & alpha", () => {
      const red = 255;
      const green = 255;
      const blue = 255;
      const alpha = 1;
      const expected = "#FFFFFFFF";

      expect(rgbToHex(red, green, blue, alpha)).toEqual(expected);
    });

    test("should auto fill alpha", () => {
      const red = 0;
      const green = 0;
      const blue = 0;
      const expected = "#000000FF";

      expect(rgbToHex(red, green, blue)).toEqual(expected);
    });
  });
});

describe("rgbToHsl", () => {
  describe("should throw if invalid rgb values", () => {
    test("rgb contains negative values", () => {
      const red = -1;
      const green = 0;
      const blue = 0;
      const colorString = `rgb(${red}, ${green}, ${blue})`;
      const errorMessage = ColorError.InvalidRGBCode(colorString).message;

      expect(() => rgbToHsl(red, green, blue)).toThrow(errorMessage);
    });

    test("rgb contains values out of bounds", () => {
      const red = 256;
      const green = 0;
      const blue = 0;
      const colorString = `rgb(${red}, ${green}, ${blue})`;
      const errorMessage = ColorError.InvalidRGBCode(colorString).message;

      expect(() => rgbToHsl(red, green, blue)).toThrow(errorMessage);
    });

    test("rgba contains alpha out of bounds", () => {
      const red = 0;
      const green = 0;
      const blue = 0;
      const alpha = 2;
      const colorString = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
      const errorMessage = ColorError.InvalidRGBCode(colorString).message;

      expect(() => rgbToHsl(red, green, blue, alpha)).toThrow(errorMessage);
    });
  });

  describe("should return correct hue, saturation, light, & alpha values", () => {
    test("valid red, blue, green, & alpha", () => {
      const red = 0;
      const green = 0;
      const blue = 0;
      const alpha = 0.5;
      const expected: HueSaturationLightnessAlpha = { hue: 0, saturation: 0, lightness: 0, alpha: 0.5 };

      expect(rgbToHsl(red, green, blue, alpha)).toEqual(expected);
    });

    test("should auto fill alpha", () => {
      const red = 0;
      const green = 0;
      const blue = 0;
      const expected: HueSaturationLightnessAlpha = { hue: 0, saturation: 0, lightness: 0, alpha: 1 };

      expect(rgbToHsl(red, green, blue)).toEqual(expected);
    });
  });
});
