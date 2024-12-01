import { parse, format, addHours, differenceInHours, parseISO } from "date-fns";

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

export const parseDateTime = (dateTimeString) => {
  if (!dateTimeString || typeof dateTimeString !== "string") {
    console.error("Invalid dateTimeString:", dateTimeString);
    return null; // Handle invalid or null/undefined input
  }
  return parse(dateTimeString, "dd/MM/yyyy HH:mm:ss", new Date());
};
