/** Extracts the number from a label such as "Tax: $2.40". */
export function parseMoney(label: string | null): number {
  const match = label?.match(/\$\s*([\d,]+\.\d{2})/);
  const value = match?.[1];

  if (value === undefined) {
    throw new Error(`Expected a currency value like "$12.34" but found: ${JSON.stringify(label)}`);
  }

  return Number(value.replace(/,/g, ''));
}

export function roundHalfUpToCents(value: number): number {
  return Math.round(value * 100) / 100;
}
