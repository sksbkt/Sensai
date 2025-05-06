import { clsx, type ClassValue } from "clsx";
import { format, parse } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string in the "yyyy-MM" format into a more readable "MMM yyyy" format.
 *
 * @param dateString - The date string to format, expected in the "yyyy-MM" format.
 * @returns A formatted date string in the "MMM yyyy" format, or an empty string if the input is invalid.
 */
export const formateDisplayDate = (
  dateString: string,
  formatStr: string = "MMM yyyy"
) => {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, formatStr);
};
