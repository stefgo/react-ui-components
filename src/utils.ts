import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges multiple class names into a single string, handling Tailwind CSS conflicts.
 * @param inputs - The class names or expressions to merge.
 * @returns A merged string of class names.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
