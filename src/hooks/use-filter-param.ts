'use client';

import { useMemo } from 'react';
import { useQueryState, parseAsString } from 'nuqs';
import { MailTypes } from '@/modules/secretary/mails/types';
import { MailStatuses } from '@/modules/secretary/mails/types';

export interface Filters {
  type?: MailTypes;
  status?: MailStatuses;
  search?: string;
  senderId?: string;
  receiverId?: string;
  userId?: string;
  tableName?: string;
  from?: string;
  to?: string;
}

export function useFilters(): {
  filters: Filters;
  setType: (v: string) => void;
  setStatus: (v: string) => void;
  setSearch: (v: string) => void;
  setSenderId: (v: string) => void;
  setReceiverId: (v: string) => void;
  setUserId: (v: string) => void;
  setTableName: (v: string) => void;
  setFrom: (v: string) => void;
  setTo: (v: string) => void;
} {
  // نستخدم parseAsString لأن القيم أصلًا نصية
  const [typeStr, setType] = useQueryState(
    'type',
    parseAsString.withDefault('').withOptions({ clearOnDefault: true })
  );
  const [statusStr, setStatus] = useQueryState(
    'status',
    parseAsString.withDefault('').withOptions({ clearOnDefault: true })
  );
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault('').withOptions({ clearOnDefault: true })
  );
  const [senderId, setSenderId] = useQueryState(
    'senderId',
    parseAsString.withDefault('').withOptions({ clearOnDefault: true })
  );
  const [receiverId, setReceiverId] = useQueryState(
    'receiverId',
    parseAsString.withDefault('').withOptions({ clearOnDefault: true })
  );
  const [userId, setUserId] = useQueryState(
    'userId',
    parseAsString.withDefault('').withOptions({ clearOnDefault: true })
  );
  const [tableName, setTableName] = useQueryState(
    'tableName',
    parseAsString.withDefault('').withOptions({ clearOnDefault: true })
  );
  const [from, setFrom] = useQueryState(
    'from',
    parseAsString.withDefault('').withOptions({ clearOnDefault: true })
  );
  const [to, setTo] = useQueryState(
    'to',
    parseAsString.withDefault('').withOptions({ clearOnDefault: true })
  );

  // ندقق أنّ النص هو قيمة صالحة في الـ enum، وإلّا يكون undefined
  const type = useMemo<MailTypes | undefined>(() => {
    return Object.values(MailTypes).includes(typeStr as MailTypes)
      ? (typeStr as MailTypes)
      : undefined;
  }, [typeStr]);

  const status = useMemo<MailStatuses | undefined>(() => {
    return Object.values(MailStatuses).includes(statusStr as MailStatuses)
      ? (statusStr as MailStatuses)
      : undefined;
  }, [statusStr]);

  const filters = useMemo<Filters>(
    () => ({
      type,
      status,
      search: search || undefined,
      senderId: senderId || undefined,
      receiverId: receiverId || undefined,
      userId: userId || undefined,
      tableName: tableName || undefined,
      from: from || undefined,
      to: to || undefined,
    }),
    [type, status, search, senderId, receiverId, userId, tableName, from, to]
  );

  return {
    filters,
    setType,
    setStatus,
    setSearch,
    setSenderId,
    setReceiverId,
    setUserId,
    setTableName,
    setFrom,
    setTo,
  };
}
