export const MONTHS = Array.from({ length: 12 }, (e, i) => {
  return new Date(0, i + 1, 0).toLocaleDateString('en', {
    month: 'short',
  });
});
