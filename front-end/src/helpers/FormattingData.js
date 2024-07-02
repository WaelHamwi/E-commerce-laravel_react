export default function ConvertDate(date) {
  const currentDate = new Date(date);

  const year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  let day = currentDate.getDate();
  day = day < 10 ? "0" + day : day;

  return `${year}-${month}-${day}`;
}
