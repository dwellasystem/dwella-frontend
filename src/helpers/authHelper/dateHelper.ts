export const formatDateToHumanReadable = (isoDate: string): string => {
  const date = new Date(isoDate);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleString(undefined, options);
};

export const convertHumanReadableToISO = (readableDate: string): string => {
  const date = new Date(readableDate);
  return date.toISOString();
};
