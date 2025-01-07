const daysInIndonesian = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const monthsInIndonesian = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const formatIndonesianDate = (dateString) => {
  const date = new Date(dateString);

  date.setHours(date.getHours() + 7);

  const dayName = daysInIndonesian[date.getUTCDay()];
  const day = date.getUTCDate();
  const monthName = monthsInIndonesian[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hour = String(date.getUTCHours()).padStart(2, "0");
  const minute = String(date.getUTCMinutes()).padStart(2, "0");
  const second = String(date.getUTCSeconds()).padStart(2, "0");

  return `${dayName}, ${day} ${monthName} ${year}, ${hour}:${minute}:${second}`;
};

export default formatIndonesianDate;
