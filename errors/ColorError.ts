import { SPELLING_ERRORS } from "@/errors/SpellingErrors";

class ColorError extends Error {
  private static getMessage(color: string) {
    return `Invalid color, "${color}"`;
  }

  private static CheckSpellingErrors(color: string) {
    for (const { regex, getMessage } of SPELLING_ERRORS) {
      const match = color.match(regex);

      if (match && match.length === 1) return getMessage(match[0]);
    }
  }

  static SpellingError(color: string, errorMessage: string) {
    new this(`${this.getMessage(color)}: ${errorMessage}`);
  }

  static InvalidColor(color: string) {
    this.CheckSpellingErrors(color);

    return new this(`${this.getMessage(color)}`);
  }

  static InvalidHexCode(color: string) {
    return new this(`${this.getMessage(color)} not a valid HEX code`);
  }

  static InvalidRGBCode(color: string) {
    this.CheckSpellingErrors(color);

    return new this(`${this.getMessage(color)} not a valid RGB code`);
  }

  static InvalidHSLCode(color: string) {
    this.CheckSpellingErrors(color);

    return new this(`${this.getMessage(color)} not a valid HSL code`);
  }

  static InvalidValue(color: string, value: number | string) {
    const message = `has an invalid value "${value}"`;

    return new this(`${this.getMessage(color)} ${message}`);
  }
}

export { ColorError };
