/**
 * @description Calculates the amount of minutes between booking
 * .025 credits per minute
 * @param start
 * @param end
 * @returns
 */
export const calculateCredits = (
  start: string | number | Date,
  end: string | number | Date
): number => {
  return ~~((+new Date(end) - +new Date(start)) / (1000 * 60)) / 40;
};
