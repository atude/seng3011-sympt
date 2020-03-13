export const dateRegex = /\d{1,2} \w+ \d{4}/gi;

export const formatDateToExact = (dateString: string) => {
  const dateRaw = new Date(`${dateString}`);
  // Account for timezone offsets
  return dateRaw.toISOString().split("T")[0];
};
