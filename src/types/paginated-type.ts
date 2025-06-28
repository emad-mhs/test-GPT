export type Paginated<T> = {
  items: T[];
  nextCursor: { id: string; createdAt: Date } | null;
};

/* ثم في كل ملف: */
// getNextPageParam: (lastPage: Paginated<Category>) => lastPage.nextCursor,
