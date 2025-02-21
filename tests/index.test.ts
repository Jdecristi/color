import { describe, expect, test } from "bun:test";

import { ColorError } from "@/errors/ColorError";
import { Color } from "@/index";

type ColorTest = {
  hexCodes: { input: string; description: string }[];
  rgbCodes: { input: string; description: string }[];
  hslCodes: { input: string; description: string }[];
  expected: {
    "Hex code": string;
    red: number;
    green: number;
    blue: number;
    hue?: number;
    saturation?: number;
    lightness: number;
    alpha: number;
  };
};

const COLOR_TESTS = {
  white: {
    hexCodes: [
      { input: "#FFF", description: "should handle short hex" },
      { input: "#fff", description: "should capitalize all letters in short hex" },
      { input: "#FFFFFF", description: "should auto fill alpha" },
      { input: "#ffffff", description: "should auto fill alpha & capitalize all letters" },
      { input: "#FFFFFFFF", description: "should handle full Hex code" },
      { input: "#ffffffff", description: "capitalize all letters in full Hex code" },
    ],
    rgbCodes: [
      { input: "rgb(255, 255, 255)", description: "should handle rgb codes" },
      { input: "rgba(255, 255, 255, 1)", description: "should handle rgba codes" },
    ],
    hslCodes: [
      { input: "hsl(0, 0%, 100%)", description: "should handle hsl codes" },
      { input: "hsla(0, 0%, 100%, 1)", description: "should handle hsla codes" },
    ],
    rgbValues: { red: 255, green: 255, blue: 255, alpha: 1 },
    hslValues: { hue: 0, saturation: 0, lightness: 1, alpha: 1 },
    expected: { "Hex code": "#FFFFFFFF", red: 255, green: 255, blue: 255, lightness: 1, alpha: 1 },
  },
  black: {
    hexCodes: [
      { input: "#000", description: "should handle short hex" },
      { input: "#000000", description: "should auto fill alpha" },
      { input: "#000000FF", description: "should handle full Hex code" },
      { input: "#000000ff", description: "capitalize all letters in full Hex code" },
    ],
    rgbCodes: [
      { input: "rgb(0, 0, 0)", description: "should handle rgb codes" },
      { input: "rgba(0, 0, 0, 1)", description: "should handle rgba codes" },
    ],
    hslCodes: [
      { input: "hsl(0, 0%, 0%)", description: "should handle hsl codes" },
      { input: "hsla(0, 0%, 0%, 1)", description: "should handle hsla codes" },
    ],
    rgbValues: { red: 0, green: 0, blue: 0, alpha: 1 },
    hslValues: { hue: 0, saturation: 0, lightness: 0, alpha: 1 },
    expected: { "Hex code": "#000000FF", red: 0, green: 0, blue: 0, lightness: 0, alpha: 1 },
  },
  transparent: {
    hexCodes: [{ input: "#00000000", description: "should handle transparent" }],
    rgbCodes: [{ input: "rgba(0, 0, 0, 0)", description: "should handle rgba codes" }],
    hslCodes: [{ input: "hsla(0, 0%, 0%, 0)", description: "should handle hsla codes" }],
    rgbValues: { red: 0, green: 0, blue: 0, alpha: 0 },
    hslValues: { hue: 0, saturation: 0, lightness: 0, alpha: 0 },
    expected: { "Hex code": "#00000000", red: 0, green: 0, blue: 0, lightness: 0, alpha: 0 },
  },
  red: {
    hexCodes: [
      { input: "#F00", description: "should handle short hex" },
      { input: "#f00", description: "should capitalize all letters in short hex" },
      { input: "#FF0000", description: "should auto fill alpha" },
      { input: "#ff0000", description: "should auto fill alpha & capitalize all letters" },
      { input: "#FF0000FF", description: "should handle full Hex code" },
      { input: "#ff0000ff", description: "capitalize all letters in full Hex code" },
    ],
    rgbCodes: [
      { input: "rgb(255, 0, 0)", description: "should handle rgb codes" },
      { input: "rgba(255, 0, 0, 1)", description: "should handle rgba codes" },
    ],
    hslCodes: [
      { input: "hsl(0, 100%, 50%)", description: "should handle hsl codes" },
      { input: "hsla(0, 100%, 50%, 1)", description: "should handle hsla codes" },
    ],
    rgbValues: { red: 255, green: 0, blue: 0, alpha: 1 },
    hslValues: { hue: 0, saturation: 1, lightness: 0.5, alpha: 1 },
    expected: { "Hex code": "#FF0000FF", red: 255, green: 0, blue: 0, hue: 0, saturation: 1, lightness: 0.5, alpha: 1 },
  },
  orange: {
    hexCodes: [
      { input: "#FF8000", description: "should auto fill alpha" },
      { input: "#FF8000", description: "should auto fill alpha & capitalize all letters" },
      { input: "#FF8000FF", description: "should handle full Hex code" },
      { input: "#ff8000ff", description: "capitalize all letters in full Hex code" },
    ],
    rgbCodes: [
      { input: "rgb(255, 128, 0)", description: "should handle rgb codes" },
      { input: "rgba(255, 128, 0, 1)", description: "should handle rgba codes" },
    ],
    hslCodes: [
      { input: "hsl(30, 100%, 50%)", description: "should handle hsl codes" },
      { input: "hsla(30, 100%, 50%, 1)", description: "should handle hsla codes" },
    ],
    rgbValues: { red: 255, green: 128, blue: 0, alpha: 1 },
    hslValues: { hue: 30, saturation: 1, lightness: 0.5, alpha: 1 },
    expected: {
      "Hex code": "#FF8000FF",
      red: 255,
      green: 128,
      blue: 0,
      hue: 30,
      saturation: 1,
      lightness: 0.5,
      alpha: 1,
    },
  },
  yellow: {
    hexCodes: [
      { input: "#FF0", description: "should handle short hex" },
      { input: "#ff0", description: "should capitalize all letters in short hex" },
      { input: "#FFFF00", description: "should auto fill alpha" },
      { input: "#ffff00", description: "should auto fill alpha & capitalize all letters" },
      { input: "#FFFF00FF", description: "should handle full Hex code" },
      { input: "#ffff00ff", description: "capitalize all letters in full Hex code" },
    ],
    rgbCodes: [
      { input: "rgb(255, 255, 0)", description: "should handle rgb codes" },
      { input: "rgba(255, 255, 0, 1)", description: "should handle rgba codes" },
    ],
    hslCodes: [
      { input: "hsl(60, 100%, 50%)", description: "should handle hsl codes" },
      { input: "hsla(60, 100%, 50%, 1)", description: "should handle hsla codes" },
    ],
    rgbValues: { red: 255, green: 255, blue: 0, alpha: 1 },
    hslValues: { hue: 60, saturation: 1, lightness: 0.5, alpha: 1 },
    expected: {
      "Hex code": "#FFFF00FF",
      red: 255,
      green: 255,
      blue: 0,
      hue: 60,
      saturation: 1,
      lightness: 0.5,
      alpha: 1,
    },
  },
  green: {
    hexCodes: [
      { input: "#0F0", description: "should handle short hex" },
      { input: "#0f0", description: "should capitalize all letters in short hex" },
      { input: "#00FF00", description: "should auto fill alpha" },
      { input: "#00ff00", description: "should auto fill alpha & capitalize all letters" },
      { input: "#00FF00FF", description: "should handle full Hex code" },
      { input: "#00ff00ff", description: "capitalize all letters in full Hex code" },
    ],
    rgbCodes: [
      { input: "rgb(0, 255, 0)", description: "should handle rgb codes" },
      { input: "rgba(0, 255, 0, 1)", description: "should handle rgba codes" },
    ],
    hslCodes: [
      { input: "hsl(120, 100%, 50%)", description: "should handle hsl codes" },
      { input: "hsla(120, 100%, 50%, 1)", description: "should handle hsla codes" },
    ],
    rgbValues: { red: 0, green: 255, blue: 0, alpha: 1 },
    hslValues: { hue: 120, saturation: 1, lightness: 0.5, alpha: 1 },
    expected: {
      "Hex code": "#00FF00FF",
      red: 0,
      green: 255,
      blue: 0,
      hue: 120,
      saturation: 1,
      lightness: 0.5,
      alpha: 1,
    },
  },
  blue: {
    hexCodes: [
      { input: "#00F", description: "should handle short hex" },
      { input: "#00f", description: "should capitalize all letters in short hex" },
      { input: "#0000FF", description: "should auto fill alpha" },
      { input: "#0000ff", description: "should auto fill alpha & capitalize all letters" },
      { input: "#0000FFFF", description: "should handle full Hex code" },
      { input: "#0000ffff", description: "capitalize all letters in full Hex code" },
    ],
    rgbCodes: [
      { input: "rgb(0, 0, 255)", description: "should handle rgb codes" },
      { input: "rgba(0, 0, 255, 1)", description: "should handle rgba codes" },
    ],
    hslCodes: [
      { input: "hsl(240, 100%, 50%)", description: "should handle hsl codes" },
      { input: "hsla(240, 100%, 50%, 1)", description: "should handle hsla codes" },
    ],
    rgbValues: { red: 0, green: 0, blue: 255, alpha: 1 },
    hslValues: { hue: 240, saturation: 1, lightness: 0.5, alpha: 1 },
    expected: {
      "Hex code": "#0000FFFF",
      red: 0,
      green: 0,
      blue: 255,
      hue: 240,
      saturation: 1,
      lightness: 0.5,
      alpha: 1,
    },
  },
  purple: {
    hexCodes: [
      { input: "#FF00FF", description: "should auto fill alpha" },
      { input: "#FF00FF", description: "should auto fill alpha & capitalize all letters" },
      { input: "#FF00FFFF", description: "should handle full Hex code" },
      { input: "#ff00ffff", description: "capitalize all letters in full Hex code" },
    ],
    rgbCodes: [
      { input: "rgb(255, 0, 255)", description: "should handle rgb codes" },
      { input: "rgba(255, 0, 255, 1)", description: "should handle rgba codes" },
    ],
    hslCodes: [
      { input: "hsl(300, 100%, 50%)", description: "should handle hsl codes" },
      { input: "hsla(300, 100%, 50%, 1)", description: "should handle hsla codes" },
    ],
    rgbValues: { red: 255, green: 0, blue: 255, alpha: 1 },
    hslValues: { hue: 300, saturation: 1, lightness: 0.5, alpha: 1 },
    expected: {
      "Hex code": "#FF00FFFF",
      red: 255,
      green: 0,
      blue: 255,
      hue: 300,
      saturation: 1,
      lightness: 0.5,
      alpha: 1,
    },
  },
};

const testColor = (color: Color, expected: ColorTest["expected"]) => {
  for (const value in expected) {
    const expectedValue = expected[value as keyof typeof expected];
    const colorValue = value === "Hex code" ? color.toHex() : color[value as keyof Color];

    test(`${value} should be ${expectedValue}`, () => {
      expect(colorValue).toBe(expectedValue as Exclude<typeof expectedValue, undefined>);
    });
  }
};

describe("Color", () => {
  describe("new Color with Hex Code", () => {
    describe("should throw if invalid HEX code", () => {
      test(`hex code does not have a "#"`, () => {
        const hexCode = "FFFFFF";
        const errorMessage = ColorError.InvalidColor(hexCode).message;

        expect(() => new Color(hexCode)).toThrow(errorMessage);
      });

      test("hex code has invalid characters", () => {
        const hexCode = "#EEEGEE";
        const errorMessage = ColorError.InvalidHexCode(hexCode).message;

        expect(() => new Color(hexCode)).toThrow(errorMessage);
      });

      test("hex code does not have enough characters", () => {
        const hexCode = "#FF";
        const errorMessage = ColorError.InvalidHexCode(hexCode).message;

        expect(() => new Color(hexCode)).toThrow(errorMessage);
      });

      test("hex code does not has too many characters", () => {
        const hexCode = "#FFFFFFFFF";
        const errorMessage = ColorError.InvalidHexCode(hexCode).message;

        expect(() => new Color(hexCode)).toThrow(errorMessage);
      });

      test("hex code has 4 characters", () => {
        const hexCode = "#FFFF";
        const errorMessage = ColorError.InvalidHexCode(hexCode).message;

        expect(() => new Color(hexCode)).toThrow(errorMessage);
      });

      test("hex code has 5 characters", () => {
        const hexCode = "#FFFFF";
        const errorMessage = ColorError.InvalidHexCode(hexCode).message;

        expect(() => new Color(hexCode)).toThrow(errorMessage);
      });

      test("hex code has 7 characters", () => {
        const hexCode = "#FFFFF";
        const errorMessage = ColorError.InvalidHexCode(hexCode).message;

        expect(() => new Color(hexCode)).toThrow(errorMessage);
      });
    });

    describe("Should return new color", () => {
      for (const color in COLOR_TESTS) {
        const { hexCodes, expected } = COLOR_TESTS[color as keyof typeof COLOR_TESTS];
        describe(color, () => {
          for (const { description, input } of hexCodes) {
            describe(description, () => {
              const color = new Color(input);
              testColor(color, expected);
            });
          }
        });
      }
    });
  });

  describe("new Color with RGB Code", () => {
    describe("should throw if invalid RGB code", () => {
      test("rgb mispelled as rbg", () => {
        const color = "rbg(0, 0, 0)";
        const errorMessage = ColorError.InvalidColor(color).message;

        expect(() => new Color(color)).toThrow(errorMessage);
      });

      test("rgb contains non-numeric values", () => {
        const color = "rgb(x, 0, 0)";
        const errorMessage = ColorError.InvalidRGBCode(color).message;

        expect(() => new Color(color)).toThrow(errorMessage);
      });

      test("rgb contains negative values", () => {
        const color = "rgb(-1, 0, 0)";
        const errorMessage = ColorError.InvalidRGBCode(color).message;

        expect(() => new Color(color)).toThrow(errorMessage);
      });

      test("rgb contains values out of bounds", () => {
        const color = "rgb(256, 0, 0)";
        const errorMessage = ColorError.InvalidRGBCode(color).message;

        expect(() => new Color(color)).toThrow(errorMessage);
      });

      test("rgba contains alpha out of bounds", () => {
        const color = "rgb(255, 0, 0, 2)";
        const errorMessage = ColorError.InvalidRGBCode(color).message;

        expect(() => new Color(color)).toThrow(errorMessage);
      });
    });

    describe("Should return new color", () => {
      for (const color in COLOR_TESTS) {
        const { rgbCodes, expected } = COLOR_TESTS[color as keyof typeof COLOR_TESTS];

        describe(color, () => {
          for (const { description, input } of rgbCodes) {
            describe(description, () => {
              const color = new Color(input);

              testColor(color, expected);
            });
          }
        });
      }
    });
  });

  describe("new Color with HSL Code", () => {
    describe("should throw if invalid HSL code", () => {
      test("hsl mispelled as hls", () => {
        const color = "hls(0, 0, 0)";
        const errorMessage = ColorError.InvalidColor(color).message;

        expect(() => new Color(color)).toThrow(errorMessage);
      });

      test("hsl contains non-numeric values", () => {
        const color = "hsl(x, 0, 0)";
        const errorMessage = ColorError.InvalidHSLCode(color).message;

        expect(() => new Color(color)).toThrow(errorMessage);
      });

      test("hsl contains negative values", () => {
        const color = "hsl(-1, 0, 0)";
        const errorMessage = ColorError.InvalidHSLCode(color).message;

        expect(() => new Color(color)).toThrow(errorMessage);
      });

      test("hsl contains values out of bounds", () => {
        const color = "hsl(360, 0, 0)";
        const errorMessage = ColorError.InvalidHSLCode(color).message;

        expect(() => new Color(color)).toThrow(errorMessage);
      });

      test("hsla contains alpha out of bounds", () => {
        const color = "hsl(255, 0, 0, 2)";
        const errorMessage = ColorError.InvalidHSLCode(color).message;

        expect(() => new Color(color)).toThrow(errorMessage);
      });
    });

    describe("Should return new color", () => {
      for (const color in COLOR_TESTS) {
        const { hslCodes, expected } = COLOR_TESTS[color as keyof typeof COLOR_TESTS];

        describe(color, () => {
          for (const { description, input } of hslCodes) {
            describe(description, () => {
              const color = new Color(input);
              testColor(color, expected);
            });
          }
        });
      }
    });
  });

  describe("new Color with RGB values", () => {
    describe("should throw if invalid RGB values", () => {
      test("rgb contains negative values", () => {
        const red = -1;
        const green = 0;
        const blue = 0;
        const colorString = `rgb(${red}, ${green}, ${blue})`;
        const errorMessage = ColorError.InvalidRGBCode(colorString).message;

        expect(() => Color.rgb(red, green, blue)).toThrow(errorMessage);
      });

      test("rgb contains values out of bounds", () => {
        const red = 256;
        const green = 0;
        const blue = 0;
        const colorString = `rgb(${red}, ${green}, ${blue})`;
        const errorMessage = ColorError.InvalidRGBCode(colorString).message;

        expect(() => Color.rgb(red, green, blue)).toThrow(errorMessage);
      });

      test("rgba contains alpha out of bounds", () => {
        const red = 0;
        const green = 0;
        const blue = 0;
        const alpha = 2;
        const colorString = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        const errorMessage = ColorError.InvalidRGBCode(colorString).message;

        expect(() => Color.rgb(red, green, blue, alpha)).toThrow(errorMessage);
      });
    });

    describe("Should return new color", () => {
      for (const colorName in COLOR_TESTS) {
        const { rgbValues, expected } = COLOR_TESTS[colorName as keyof typeof COLOR_TESTS];
        const { red, green, blue, alpha } = rgbValues;

        describe(colorName, () => {
          describe("should handle rgb values", () => {
            const color = Color.rgb(red, green, blue, alpha);

            testColor(color, expected);
          });
        });
      }
    });
  });

  describe("new Color with HSL values", () => {
    describe("should throw if invalid HSL values", () => {
      test("hsl contains negative values", () => {
        const hue = -1;
        const saturation = 0;
        const lightness = 0;
        const colorString = `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`;
        const errorMessage = ColorError.InvalidHSLCode(colorString).message;

        expect(() => Color.hsl(hue, saturation, lightness)).toThrow(errorMessage);
      });

      test("hsl contains hue out of bounds", () => {
        const hue = 360;
        const saturation = 0;
        const lightness = 0;
        const colorString = `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`;
        const errorMessage = ColorError.InvalidHSLCode(colorString).message;

        expect(() => Color.hsl(hue, saturation, lightness)).toThrow(errorMessage);
      });

      test("hsl contains saturation out of bounds", () => {
        const hue = 0;
        const saturation = 1.1;
        const lightness = 0;
        const colorString = `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`;
        const errorMessage = ColorError.InvalidHSLCode(colorString).message;

        expect(() => Color.hsl(hue, saturation, lightness)).toThrow(errorMessage);
      });

      test("hsl contains lightness out of bounds", () => {
        const hue = 0;
        const saturation = 0;
        const lightness = 1.1;
        const colorString = `hsl(${hue}, ${saturation * 100}%, ${lightness * 100}%)`;
        const errorMessage = ColorError.InvalidHSLCode(colorString).message;

        expect(() => Color.hsl(hue, saturation, lightness)).toThrow(errorMessage);
      });

      test("hsla contains alpha out of bounds", () => {
        const hue = 0;
        const saturation = 0;
        const lightness = 0;
        const alpha = 1.1;
        const colorString = `hsla(${hue}, ${saturation * 100}%, ${lightness * 100}%, ${alpha})`;
        const errorMessage = ColorError.InvalidHSLCode(colorString).message;

        expect(() => Color.hsl(hue, saturation, lightness, alpha)).toThrow(errorMessage);
      });
    });

    describe("Should return new color", () => {
      for (const colorName in COLOR_TESTS) {
        const { hslValues, expected } = COLOR_TESTS[colorName as keyof typeof COLOR_TESTS];
        const { hue, saturation, lightness, alpha } = hslValues;

        describe(colorName, () => {
          describe("should handle rgb values", () => {
            const color = Color.hsl(hue, saturation, lightness, alpha);

            testColor(color, expected);
          });
        });
      }
    });
  });

  describe("modifying colors", () => {
    test("Color should be gray", () => {
      const color = Color.white;
      const expected = new Color("#808080").toHex();

      color.lightness = 0.5;

      expect(color.toHex()).toBe(expected);
    });

    test("Color should be green", () => {
      const color = Color.white;
      const expected = new Color("#00FF00").toHex();

      color.red = 0;
      color.blue = 0;

      expect(color.toHex()).toBe(expected);
    });
    test("Color should be black", () => {
      const color = Color.white;
      const expected = new Color("#000").toHex();

      color.lightness = 0;

      expect(color.toHex()).toBe(expected);
    });
  });
});
