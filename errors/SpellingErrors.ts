const HEX_MISSING_HASH_REGEXP = /^[A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}$/;
const HSL_SPELLING_ERRORS_REGEX = /^(HSL)|(hls)|(HLS)"/;
const RGB_SPELLING_ERRORS_REGEX = /^(RGB)|(rbg)|(RBG)"/;

const getBasicSpellingErrorMessage = (correction: string) => (error: string) => {
  return `"${error}" is not a valid color format, did you mean "${correction}" instead?`;
};

const SPELLING_ERRORS = [
  {
    regex: HEX_MISSING_HASH_REGEXP,
    getMessage: (error: string) => `"${error}" is not a valid color format, did you forget the "#"?`,
  },
  {
    regex: HSL_SPELLING_ERRORS_REGEX,
    getMessage: getBasicSpellingErrorMessage("hsl"),
  },
  {
    regex: RGB_SPELLING_ERRORS_REGEX,
    getMessage: getBasicSpellingErrorMessage("rgb"),
  },
];

export { SPELLING_ERRORS };
