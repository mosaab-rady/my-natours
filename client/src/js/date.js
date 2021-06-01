export function getMonthYear(date) {
  const newDate = new Date(date);
  const monthNumber = newDate.getMonth();
  const year = newDate.getUTCFullYear();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = monthNames[monthNumber];
  return { month, year };
}
