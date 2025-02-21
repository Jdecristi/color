# Color

### A minimal library for using an manipulating colors in Javascript and Typescript

- Zero runtime depenecies
- Lightweight


## Usage
```ts
const color = new Color("#0F0");

// Supports Hex
color.toHex()    // "#00FF00FF"

// Supports RGB
color.toRgb()    // "rgba(255, 255, 255, 1)"
color.red        // 255
color.green      // 255
color.blue       // 255

// Supports HSL
color.toHsl()    // "hsla(120, 100%, 50%, 1)"
color.hue        // 120
color.saturation // 1
color.lightness  // 0.5

// Opacity defaulted to "opaque"
color.opacity    // 1

```

## Installation
npm
``` bash
npm install @jdecristi/color
```

yarn
``` bash
yarn add @jdecristi/color
```

pnpm
``` bash
pnpm add @jdecristi/color
```

bun
``` bash
bun add @jdecristi/color
```
