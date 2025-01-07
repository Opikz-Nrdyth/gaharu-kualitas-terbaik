const currencyFormatter = (amount, shortFormat = false) => {
  const langLocalStorage = localStorage.lang;
  let langHeader = {
    langCode: "id",
    currencyCode: "IDR",
  };
  if (langLocalStorage) {
    langHeader = JSON.parse(langLocalStorage);
  }

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: langHeader?.currencyCode,
    minimumFractionDigits: 0,
  });
  return formatter.format(amount);
};

export default currencyFormatter;
