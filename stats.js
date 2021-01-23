const frequencyTable = {
  e: .1251,
  t: .0925,
  a: .0804,
  o: .0760,
  i: .0726,
  n: .0709,
  s: .0654,
  r: .0612,
  h: .0549,
  l: .0414,
  d: .0399,
  c: .036,
  u: .0271,
  m: .0253,
  f: .0230,
  p: .0200,
  g: .0196,
  w: .0192,
  y: .0173,
  b: .0154,
  v: .0099,
  k: .0067,
  x: .0019,
  j: .0016,
  q: .0011,
  z: .0009
};

const add = (x, y) => x + y;
const allChis = ALL_QUOTES.map(({text}) => chiSquare(text));
const meanChi = allChis.reduce(add) / allChis.length;
const varChi = allChis.map(x => (x - meanChi) ** 2).reduce(add) / allChis.length;
const stdChi = varChi ** 0.5;
const Difficulty = {
  EASY: 0,
  MEDIUM: 1,
  HARD: 2,
};

function isAlpha(char) {
  const charcode = char.charCodeAt(0);
  return 97 <= charcode && charcode <= 122;
}

function countLetterStats(text) {
  const stats = {};
  let count = 0;
  for (const letter of text) {
    const ll = letter.toLowerCase();
    if (isAlpha(ll)) {
    	stats[ll] = (stats[ll] ?? 0) + 1;
      count++;
    }
  }
  return { stats, count };
}

function expectedFreq(count, ch) {
  return Math.max(frequencyTable[ch] * count, 1);
}

function chiSquare(text) {
  const { stats, count } = countLetterStats(text);
  const expected = ch => expectedFreq(count, ch);
  return Object.entries(stats)
    .map(stat => {
      const [ch, freq] = stat;
      return (freq - expected(ch)) ** 2 / expected(ch);
    })
    .reduce(add);
}

function classifyText(text) {
  const chiScore = chiSquare(text);
  if (chiScore < meanChi - stdChi * 0.80)
    return Difficulty.EASY;
  if (chiScore > meanChi + stdChi * 0.70)
    return Difficulty.HARD;
  return Difficulty.MEDIUM;
}
