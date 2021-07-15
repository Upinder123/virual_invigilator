const checkValidDate = (dateString: any) => {
  if (Object.prototype.toString.call(dateString) === '[object Date]') {
    // it is a date
    if (Number.isNaN(dateString.getTime())) {
      // d.valueOf() could also work
      // date is not valid
      return false;
    }
    // date is valid
    return true;
  }
  // not a date
  return false;
};

export default function prettyDate(date: any) {
  const strArray = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const t = checkValidDate(date) ? date : new Date(date);
  const d = t.getDate();
  const m = strArray[t.getMonth()];
  const y = t.getFullYear();
  return `${m} ${d <= 9 ? `0${d}` : d}, ${y}`;
}
