import { describe, expect, test } from "bun:test";

import { ColorError } from "@/errors/ColorError";
import { hexToRgb, parseHex } from "@/formats/Hex";

describe("parseHex", () => {
  describe("should throw if invalid HEX code", () => {
    test(`hex code does not have a "#"`, () => {
      const color = "FFFFFF";
      const errorMessage = ColorError.InvalidColor(color).message;

      expect(() => parseHex(color)).toThrow(errorMessage);
    });

    test("hex code has invalid characters", () => {
      const color = "#EEEGEE";
      const errorMessage = ColorError.InvalidHexCode(color).message;

      expect(() => parseHex(color)).toThrow(errorMessage);
    });

    test("hex code does not have enough characters", () => {
      const color = "#FF";
      const errorMessage = ColorError.InvalidHexCode(color).message;

      expect(() => parseHex(color)).toThrow(errorMessage);
    });

    test("hex code does not has too many characters", () => {
      const color = "#FFFFFFFFF";
      const errorMessage = ColorError.InvalidHexCode(color).message;

      expect(() => parseHex(color)).toThrow(errorMessage);
    });

    test("hex code has 4 characters", () => {
      const color = "#FFFF";
      const errorMessage = ColorError.InvalidHexCode(color).message;

      expect(() => parseHex(color)).toThrow(errorMessage);
    });

    test("hex code has 5 characters", () => {
      const color = "#FFFFF";
      const errorMessage = ColorError.InvalidHexCode(color).message;

      expect(() => parseHex(color)).toThrow(errorMessage);
    });

    test("hex code has 7 characters", () => {
      const color = "#FFFFF";
      const errorMessage = ColorError.InvalidHexCode(color).message;

      expect(() => parseHex(color)).toThrow(errorMessage);
    });
  });

  describe("should return the correct hex code", () => {
    test("valid hex code", () => {
      const color = "#FFFFFFFF";
      const expected = "#FFFFFFFF";

      expect(parseHex(color)).toBe(expected);
    });

    test("should auto uppercase characters", () => {
      const color = "#fefefefe";
      const expected = "#FEFEFEFE";

      expect(parseHex(color)).toBe(expected);
    });

    test(`should autofill the alpha value as "FF"`, () => {
      const color = "#FFFFFF";
      const expected = "#FFFFFFFF";

      expect(parseHex(color)).toBe(expected);
    });

    test(`should auto complete from "short hex"`, () => {
      const color = "#FFF";
      const expected = "#FFFFFFFF";

      expect(parseHex(color)).toBe(expected);
    });
  });
});

describe("hexToRgb", () => {
  describe("should throw if invalid hex code", () => {
    test(`hex code does not have a "#"`, () => {
      const color = "FFFFFF";
      const errorMessage = ColorError.InvalidHexCode(color).message;

      expect(() => hexToRgb(color)).toThrow(errorMessage);
    });

    test("hex code has invalid characters", () => {
      const color = "#EEEGEE";
      const errorMessage = ColorError.InvalidHexCode(color).message;

      expect(() => hexToRgb(color)).toThrow(errorMessage);
    });

    test("hex code does not have enough characters", () => {
      const color = "#FF";
      const errorMessage = ColorError.InvalidHexCode(color).message;

      expect(() => hexToRgb(color)).toThrow(errorMessage);
    });

    test("hex code does not has too many characters", () => {
      const color = "#FFFFFFFFF";
      const errorMessage = ColorError.InvalidHexCode(color).message;

      expect(() => hexToRgb(color)).toThrow(errorMessage);
    });

    test("hex code has 4 characters", () => {
      const color = "#FFFF";
      const errorMessage = ColorError.InvalidHexCode(color).message;

      expect(() => hexToRgb(color)).toThrow(errorMessage);
    });

    test("hex code has 5 characters", () => {
      const color = "#FFFFF";
      const errorMessage = ColorError.InvalidHexCode(color).message;

      expect(() => hexToRgb(color)).toThrow(errorMessage);
    });

    test("hex code has 7 characters", () => {
      const color = "#FFFFF";
      const errorMessage = ColorError.InvalidHexCode(color).message;

      expect(() => hexToRgb(color)).toThrow(errorMessage);
    });
  });

  describe("return convert the hex code to red, green, blue, and alpha", () => {
    test("should convert to red, green, blue, and alpha values", () => {
      const color = "#FF008040";
      const expected = { red: 255, green: 0, blue: 128, alpha: 0.25 };

      expect(hexToRgb(color)).toEqual(expected);
    });

    test("should autofill alpha value", () => {
      const color = "#FFFFFF";
      const expected = { red: 255, green: 255, blue: 255, alpha: 1 };

      expect(hexToRgb(color)).toEqual(expected);
    });
  });
});
