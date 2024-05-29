import merge from "./merge";
import assertString from "./assertString";

const upperCaseRegex = /^[A-Z]$/;
const lowerCaseRegex = /^[a-z]$/;
const numberRegex = /^[0-9]$/;
const symbolRegex = /^[-#!$@£%^&*()_+|~=`{}\[\]:";'<>?,.\/\\ ]$/;

interface Options {
  minLength: number;
  minLowercase: number;
  minUppercase: number;
  minNumbers: number;
  minSymbols: number;
  returnScore: boolean;
  pointsPerUnique: number;
  pointsPerRepeat: number;
  pointsForContainingLower: number;
  pointsForContainingUpper: number;
  pointsForContainingNumber: number;
  pointsForContainingSymbol: number;
}

const defaultOptions: Options = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  returnScore: true,
  pointsPerUnique: 1,
  pointsPerRepeat: 0.5,
  pointsForContainingLower: 10,
  pointsForContainingUpper: 10,
  pointsForContainingNumber: 10,
  pointsForContainingSymbol: 10,
};

function countChars(str: string): Record<string, number> {
  let result: Record<string, number> = {};
  Array.from(str).forEach((char) => {
    let curVal = result[char];
    if (curVal) {
      result[char] += 1;
    } else {
      result[char] = 1;
    }
  });
  return result;
}

interface Analysis {
  length: number;
  uniqueChars: number;
  uppercaseCount: number;
  lowercaseCount: number;
  numberCount: number;
  symbolCount: number;
}

function analyzePassword(password: string): Analysis {
  let charMap = countChars(password);
  let analysis: Analysis = {
    length: password.length,
    uniqueChars: Object.keys(charMap).length,
    uppercaseCount: 0,
    lowercaseCount: 0,
    numberCount: 0,
    symbolCount: 0,
  };
  Object.keys(charMap).forEach((char) => {
    if (upperCaseRegex.test(char)) {
      analysis.uppercaseCount += charMap[char];
    } else if (lowerCaseRegex.test(char)) {
      analysis.lowercaseCount += charMap[char];
    } else if (numberRegex.test(char)) {
      analysis.numberCount += charMap[char];
    } else if (symbolRegex.test(char)) {
      analysis.symbolCount += charMap[char];
    }
  });
  return analysis;
}

function scorePassword(analysis: Analysis, scoringOptions: Options): number {
  let points = 0;
  points += analysis.uniqueChars * scoringOptions.pointsPerUnique;
  points +=
    (analysis.length - analysis.uniqueChars) * scoringOptions.pointsPerRepeat;
  if (analysis.lowercaseCount > 0) {
    points += scoringOptions.pointsForContainingLower;
  }
  if (analysis.uppercaseCount > 0) {
    points += scoringOptions.pointsForContainingUpper;
  }
  if (analysis.numberCount > 0) {
    points += scoringOptions.pointsForContainingNumber;
  }
  if (analysis.symbolCount > 0) {
    points += scoringOptions.pointsForContainingSymbol;
  }
  return points;
}

export default function isStrongPassword(
  str: string,
  options: Partial<Options> = {}
): number {
  assertString(str);
  const analysis = analyzePassword(str);
  const mergedOptions = merge(options, defaultOptions);
  return scorePassword(analysis, mergedOptions);
}
