import { clsx, type ClassValue } from 'clsx';
import { eachDayOfInterval, format, isSameDay, subDays } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const convertStatus = (status: string): string => {
  const map: Record<string, string> = {
    todo: 'في الانتظار',
    in_progress: 'قيد المعالجة',
    done: 'مكتمل',
    canceled: 'صرف النظر عنه',
    emergency: 'هام وعاجل',
    in_review: 'IN_REVIEW',
    backlog: 'BACKLOG',
  };

  return map[status] ?? 'غير معروف';
};

export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean } = {}
): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(value / 100);

  if (options.addPrefix && value > 0) return `+${formatted}`;
  return formatted;
}

interface Period {
  from?: string | Date;
  to?: string | Date;
}

export function formatDateRange(period?: Period): string {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const from = period?.from ? new Date(period.from) : defaultFrom;
  const to = period?.to ? new Date(period.to) : defaultTo;

  return `${format(from, 'LLL dd')} - ${format(to, 'LLL dd, y')}`;
}

export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }
  return ((current - previous) / previous) * 100;
}

interface ActiveDay {
  date: Date | null;
  outgoing: number;
  incoming: number;
}

export function fillMissingDays(
  activeDays: ActiveDay[],
  startDate: Date,
  endDate: Date
): ActiveDay[] {
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  return allDays.map(day => {
    const found = activeDays.find(d => d.date && isSameDay(d.date, day));
    return found ?? { date: day, outgoing: 0, incoming: 0 };
  });
}
