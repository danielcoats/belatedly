export const MONTHS = Array.from({ length: 12 }, (e, i) => {
  return new Date(0, i + 1, 0).toLocaleDateString('en', {
    month: 'short',
  });
});

export const getUserTimezone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getNextBirthday = (day: number, month: number) => {
  const now = new Date(Date.now());
  const isThisYear =
    month > now.getMonth() ||
    (month === now.getMonth() && day >= now.getDate());

  return new Date(now.getFullYear() + (isThisYear ? 0 : 1), month, day);
};

export const getNextBirthdayByDate = (date: Date) => {
  return getNextBirthday(date.getDate(), date.getMonth());
};

export const daysUntil = (date: Date) => {
  const now = new Date(Date.now());
  const nowTruncated = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  return Math.floor(
    (date.getTime() - nowTruncated.getTime()) / (1000 * 3600 * 24),
  );
};
