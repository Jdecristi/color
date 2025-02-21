const round = (number: number, decimals = 0) => {
  const offset = decimals ? 10 ** decimals : 1;

  return Math.round(number * offset) / offset;
};

export { round };
