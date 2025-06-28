import { db } from '@/db';
import { departments, mailCcs, mailDepartments, mails } from '@/db/schema';
import { getContactById } from '../contacts/utils';
import { parse } from 'date-fns';
import {
  and,
  arrayOverlaps,
  desc,
  eq,
  gte,
  like,
  lt,
  lte,
  or,
  sql,
} from 'drizzle-orm';
import { ArrowUpRight, File, House, Lock, Mail } from 'lucide-react';
import { MailStatuses, MailTypes } from './types';

export async function generateMailPath(
  type?: string,
  senderId?: string,
  receiverId?: string,
  refNum?: string
) {
  const sender = senderId ? await getContactById(senderId) : null;
  const receiver = receiverId ? await getContactById(receiverId) : null;

  if (!type || !refNum) return '';

  if (['outgoing', 'local_outgoing', 'personal'].includes(type)) {
    return `البريد/${type}/${sender?.jobTitle ?? 'غير معروف'}/${refNum}`;
  }

  if (['incoming', 'local_incoming'].includes(type)) {
    return `البريد/${type}/${receiver?.jobTitle ?? 'غير معروف'}/${refNum}`;
  }

  return '';
}

export async function generateRank(type: string, receiverId: string) {
  if (!['incoming', 'local_incoming'].includes(type)) return 0;

  const receiver = await getContactById(receiverId);
  const allDepartments = await db
    .select({
      id: departments.id,
      rank: departments.rank,
      name: departments.name,
    })
    .from(departments);

  return allDepartments.find(dep => dep.name === receiver?.jobTitle)?.rank ?? 0;
}

interface GenerateRefNumProps {
  type: string;
  receiverId: string;
}

export const generateRefNum = async ({
  type,
  receiverId,
}: GenerateRefNumProps) => {
  const currentYear = new Date().getFullYear();
  const startDate = parse(`${currentYear}-01-01`, 'yyyy-MM-dd', new Date());
  const endDate = parse(`${currentYear + 1}-01-01`, 'yyyy-MM-dd', new Date());

  const rank = await generateRank(type, receiverId);

  console.log({ rank });

  const buildRefNum = (base: string, lastRefNum: string | null) =>
    lastRefNum
      ? (Number(lastRefNum) + 1).toString()
      : (Number(base) + 1).toString();

  try {
    const baseYear = ['personal', 'local_outgoing', 'local_incoming'].includes(
      type
    )
      ? currentYear.toString()
      : currentYear.toString().slice(-2);

    const base =
      type === 'personal' ? `${baseYear}000` : `${baseYear}${rank}00000`;

    const commonWhere = [
      eq(mails.type, type as MailTypes),
      gte(mails.createdAt, startDate),
      lt(mails.createdAt, endDate),
    ];

    if (['incoming', 'local_incoming'].includes(type)) {
      commonWhere.push(eq(mails.receiverId, receiverId));
    }

    const [data] = await db
      .select({ refNum: mails.refNum })
      .from(mails)
      .where(and(...commonWhere))
      .limit(1)
      .orderBy(desc(mails.createdAt));

    const lastRefNum = data?.refNum ?? null;

    return buildRefNum(base, lastRefNum);
  } catch (err) {
    console.error('Failed to generate refNum:', err);
    return null;
  }
};

interface FormattedRefNumProps {
  type?: string | null;
  refNum?: string | null;
}

export const formattedRefNum = ({ type, refNum }: FormattedRefNumProps) => {
  const strNum = refNum?.toString();
  if (!type || !strNum) return '';

  switch (type) {
    case 'outgoing': {
      const year = strNum.slice(0, 2);
      const num = Number(strNum.slice(-5));
      return `${year}-${num}`;
    }
    case 'incoming': {
      const year = strNum.slice(0, 2);
      const rank = strNum.slice(2, -5);
      const num = Number(strNum.slice(-5));
      return `${year}-${rank}-${num}`;
    }
    case 'local_outgoing': {
      const year = strNum.slice(0, 4);
      const num = Number(strNum.slice(5));
      return `${year}-${num}`;
    }
    case 'local_incoming': {
      const year = strNum.slice(0, 4);
      const rank = strNum.slice(4, -5);
      const num = Number(strNum.slice(-5));
      return `${year}-${rank}-${num}`;
    }
    case 'personal': {
      const year = strNum.slice(0, 4);
      const num = Number(strNum.slice(4));
      return `${year}-${num}`;
    }
    default:
      return '';
  }
};

export const getIcon = (type: string) => {
  switch (type) {
    case 'outgoing':
      return <ArrowUpRight className='size-4' />;
    case 'incoming':
      return <Mail className='size-4' />;
    case 'local_outgoing':
      return (
        <span className='flex flex-row space-x-1 space-x-reverse'>
          <House className='size-4' />
          <ArrowUpRight className='size-4' />
        </span>
      );
    case 'local_incoming':
      return (
        <span className='flex flex-row space-x-1 space-x-reverse'>
          <House className='size-4' />
          <Mail className='size-4' />
        </span>
      );
    case 'personal':
      return <Lock className='size-4' />;
    case 'document':
      return <File className='size-4' />;
    default:
      return null;
  }
};

export function getDateRange(from?: string, to?: string) {
  // const defaultTo = new Date();
  // const defaultFrom = subDays(defaultTo, 30);

  const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : undefined;

  const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : undefined;

  return { startDate, endDate };
}

interface MailFilterOptions {
  isAdmin: boolean;
  departmentId: string;
  search?: string;
  from?: Date;
  to?: Date;
  type?: MailTypes;
  status?: MailStatuses;
  senderId?: string;
  receiverId?: string;
  cursor?: { createdAt: Date; id: string } | null;
}

export function buildMailWhereClause(options: MailFilterOptions) {
  const {
    isAdmin,
    departmentId,
    search,
    from,
    to,
    type,
    status,
    senderId,
    receiverId,
    cursor,
  } = options;

  return and(
    or(
      arrayOverlaps(mails.forwardTo, [`${departmentId}`]),
      eq(mails.departmentId, departmentId)
    ),
    type ? eq(mails.type, type) : undefined,
    status ? eq(mails.status, status) : undefined,
    senderId ? eq(mails.senderId, senderId) : undefined,
    receiverId
      ? or(
          arrayOverlaps(mails.cc, [`${receiverId}`]),
          eq(mails.receiverId, receiverId)
        )
      : undefined,
    !isAdmin ? sql`${mails.isSecret} = false` : undefined,
    search
      ? or(
          like(mails.subject, `%${search}%`),
          like(mails.refNum, `%${search}%`)
        )
      : undefined,
    from && to
      ? and(gte(mails.createdAt, from), lte(mails.createdAt, to))
      : undefined,
    cursor
      ? or(
          lt(mails.createdAt, cursor.createdAt),
          and(eq(mails.createdAt, cursor.createdAt), lt(mails.id, cursor.id))
        )
      : undefined
  );
}

export function buildMailPermissionFilter(
  mailId: string,
  userId: string,
  canModify: boolean | string
) {
  return or(
    and(eq(mails.id, mailId), eq(mails.userId, userId)),
    and(eq(mails.id, mailId), sql`${canModify} = true`)
  );
}

// export async function saveMailCategories(mailId: string, catgIds: string[]) {
//   if (catgIds.length === 0) return;
//   const data = catgIds.map(categoryId => ({ mailId, categoryId }));
//   await db.insert(mailCategories).values(data);
// }

export async function saveMailCCs(mailId: string, ccIds: string[]) {
  if (ccIds.length === 0) return;
  const data = ccIds.map(ccId => ({ mailId, ccId }));
  await db.insert(mailCcs).values(data);
}

export async function saveMailDepartments(mailId: string, deptIds: string[]) {
  if (deptIds.length === 0) return;
  const data = deptIds.map(departmentId => ({ mailId, departmentId }));
  await db.insert(mailDepartments).values(data);
}
