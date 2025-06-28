import { MailStatuses, MailTypes } from '@/modules/secretary/mails/types';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { differenceInDays, parse, subDays } from 'date-fns';
import { z } from 'zod';
import { fetchMailsData, getActiveDays } from '../utils';
import { getTopCategories } from '@/modules/secretary/categories/utils';
import { calculatePercentageChange, fillMissingDays } from '@/lib/utils';

export const summaryRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        type: z.nativeEnum(MailTypes).optional(),
        status: z.nativeEnum(MailStatuses).optional(),
        senderId: z.string().optional(),
        receiverId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { from, to, type, status, senderId, receiverId } = input;

      // Date Range Setup
      const today = new Date();
      const defaultFrom = subDays(today, 30);
      const startDate = from
        ? parse(from, 'yyyy-MM-dd', new Date())
        : defaultFrom;
      const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : today;

      const periodLength = differenceInDays(endDate, startDate) + 1;
      const lastPeriodStart = subDays(startDate, periodLength);
      const lastPeriodEnd = subDays(endDate, periodLength);

      // Fetch data for both periods
      const [current, previous] = await Promise.all([
        fetchMailsData(startDate, endDate, type, status, senderId, receiverId),
        fetchMailsData(
          lastPeriodStart,
          lastPeriodEnd,
          type,
          status,
          senderId,
          receiverId
        ),
      ]);

      const [currentPeriod] = current;
      const [lastPeriod] = previous;

      // Calculate changes
      const mailsChange = calculatePercentageChange(
        currentPeriod.mails,
        lastPeriod.mails
      );
      const outgoingChange = calculatePercentageChange(
        currentPeriod.outgoing,
        lastPeriod.outgoing
      );
      const incomingChange = calculatePercentageChange(
        currentPeriod.incoming,
        lastPeriod.incoming
      );

      // Other statistics
      const categories = await getTopCategories(startDate, endDate);
      const activeDays = await getActiveDays(
        startDate,
        endDate,
        type,
        status,
        senderId,
        receiverId
      );
      const days = fillMissingDays(activeDays, startDate, endDate);

      return {
        data: {
          mailsCount: currentPeriod.mails,
          mailsChange,
          outgoingCount: currentPeriod.outgoing,
          outgoingChange,
          incomingCount: currentPeriod.incoming,
          incomingChange,
          categories,
          days,
        },
      };
    }),
});
