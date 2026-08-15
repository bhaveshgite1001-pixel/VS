/**
 * Compact display: ₹1.20 Cr, ₹35.00 L, ₹35,000
 * Used in slider value badges and summary stats.
 */
export function formatINR(val: number): string {
  if (Math.abs(val) >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  } else if (Math.abs(val) >= 100000) {
    return `₹${(val / 100000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
}

/**
 * Full Indian comma-separated format for editable text inputs.
 * e.g. 12000000 => "1,20,00,000"
 */
export function formatINRInput(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.round(val));
}

/**
 * Parse a user-typed string back into a number.
 * Handles: "1,20,00,000", "1.2Cr", "1.2 Cr", "35L", "35 L", plain numbers.
 */
export function parseINRInput(str: string): number | null {
  const cleaned = str.trim().replace(/₹/g, '').replace(/,/g, '').trim();
  if (!cleaned) return null;

  // Match patterns like "1.2Cr", "1.2 Cr", "1.2cr"
  const crMatch = cleaned.match(/^([\d.]+)\s*cr$/i);
  if (crMatch) {
    const num = parseFloat(crMatch[1]);
    return isNaN(num) ? null : num * 10000000;
  }

  // Match patterns like "35L", "35 L", "35l", "35 lakhs"
  const lMatch = cleaned.match(/^([\d.]+)\s*l(akhs?)?$/i);
  if (lMatch) {
    const num = parseFloat(lMatch[1]);
    return isNaN(num) ? null : num * 100000;
  }

  // Match patterns like "35k", "35 k"
  const kMatch = cleaned.match(/^([\d.]+)\s*k$/i);
  if (kMatch) {
    const num = parseFloat(kMatch[1]);
    return isNaN(num) ? null : num * 1000;
  }

  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

