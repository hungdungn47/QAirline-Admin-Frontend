const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return {
    hour: `${hours}:${minutes}`,
    date: date.toISOString().split('T')[0], // Returns date in "YYYY-MM-DD" format
  };
};

export default formatDateTime