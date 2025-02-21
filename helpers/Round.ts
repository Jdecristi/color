const round = (number: number, decimals = 0) => {
  const offset = 10 ** decimals;

  return Math.round(number * offset) / offset;
};

export { round };
