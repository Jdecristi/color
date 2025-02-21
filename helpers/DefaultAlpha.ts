import { round } from "@/helpers/Round";

const defaultAlpha = (alpha?: number) => (alpha !== undefined ? round(alpha, 2) : 1);

export { defaultAlpha };
