/* Shared helpers for chemistry interactive demos.
   Vanilla JS, no dependencies, works via plain <script src="..."> or as a module. */

/**
 * Count significant figures in a number written as a plain decimal
 * ("3004", "0.0900") or simple scientific notation ("5.0e-9", "6.91 x 10^9").
 * Returns an integer, or null if the input isn't a parseable number.
 */
function countSigFigs(input) {
  if (input === null || input === undefined) return null;
  let s = String(input).trim();
  if (s === "") return null;
  if (s.startsWith("-")) s = s.slice(1);
  if (s.startsWith("+")) s = s.slice(1);

  // Scientific notation: "5.0e-9", "6.91E9", "6.91 x 10^9", "6.91 × 10^9"
  const sci =
    s.match(/^(\d+\.?\d*)\s*[eE]\s*([+-]?\d+)$/) ||
    s.match(/^(\d+\.?\d*)\s*[x×]\s*10\s*\^?\s*([+-]?\d+)$/i);
  if (sci) {
    let digits = sci[1].replace(".", "");
    digits = digits.replace(/^0+/, "");
    return digits.length === 0 ? 1 : digits.length;
  }

  if (!/^\d*\.?\d*$/.test(s) || s === "." ) return null;

  const hasDecimal = s.includes(".");

  if (hasDecimal) {
    let [intPart, fracPart] = s.split(".");
    intPart = intPart || "0";
    fracPart = fracPart || "";
    const intIsZero = intPart.replace(/0/g, "") === "";

    if (intIsZero) {
      // e.g. 0.0857, 0.000300 -- leading zeros never significant,
      // everything from the first nonzero digit onward is.
      const trimmed = fracPart.replace(/^0+/, "");
      return trimmed.length; // 0 for "0" or "0.0" etc.
    } else {
      // e.g. 27.661 -- all digits from the first nonzero integer digit on are significant.
      const combined = intPart.replace(/^0+/, "") + fracPart;
      return combined.length;
    }
  } else {
    // No decimal point: leading zeros aren't significant (rare in practice),
    // trailing zeros are treated as NOT significant (standard convention).
    const trimmed = s.replace(/^0+/, "");
    if (trimmed === "") return 0;
    const stripped = trimmed.replace(/0+$/, "");
    return stripped.length === 0 ? 1 : stripped.length;
  }
}

/** Count digits after the decimal point (0 if there is no decimal point). */
function countDecimalPlaces(input) {
  const s = String(input).trim();
  if (!s.includes(".")) return 0;
  return s.split(".")[1].length;
}

/** Round a number to a given number of significant figures. */
function roundToSigFigs(num, sig) {
  if (num === 0) return 0;
  const d = Math.ceil(Math.log10(Math.abs(num)));
  const power = sig - d;
  const magnitude = Math.pow(10, power);
  return Math.round(num * magnitude) / magnitude;
}

/** Round a number to a fixed number of decimal places, returned as a Number. */
function roundToDecimalPlaces(num, dp) {
  return Number(num.toFixed(Math.max(0, dp)));
}
