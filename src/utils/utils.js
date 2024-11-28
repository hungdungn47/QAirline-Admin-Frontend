const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return {
    hour: dateTimeStr.split(" ")[1],
    date: dateTimeStr.split(" ")[0], // Returns date in "YYYY-MM-DD" format
  };
};

export default formatDateTime;
