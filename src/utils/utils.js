export const getHourAndDate = (dateTimeStr) => {
  return {
    hour: dateTimeStr.split(" ")[1].slice(0, 5),
    date: dateTimeStr.split(" ")[0],
  };
};
export const fromDateTimeLocalFormat = (isoString) => {
  const date = parseISO(isoString);
  return format(date, "MM/dd/yyyy HH:mm:ss");
};
