export const formatTimeString = (input: string): string => {
  const regex = /^(\d+)([smhd])?$/;

  const unitMap: Record<string, string> = {
    s: 'second',
    m: 'minute',
    h: 'hour',
    d: 'day',
    undefined: 'millisecond' // default if no unit
  };

  const match = input.trim().match(regex);

  if (!match) {
    throw new Error(`Invalid time format: "${input}"`);
  }

  const value: number = parseInt(match[1], 10);
  const unitKey: string | undefined = match[2];
  const baseUnit: string = unitMap[unitKey];

  const unit: string = value === 1 ? baseUnit : `${baseUnit}s`;

  return `${value} ${unit}`;
};
