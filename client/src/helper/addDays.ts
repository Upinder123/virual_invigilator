export const addDays = (days: number) => {
  const someDate = new Date();
  someDate.setDate(someDate.getDate() + days);
  return someDate;
};
