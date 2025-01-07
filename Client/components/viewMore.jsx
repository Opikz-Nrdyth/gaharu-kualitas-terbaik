import { useState } from "react";

const ViewMore = (input, minInput, maxInput) => {
  const [maxKata, setMaxKata] = useState(minInput); // Batas awal adalah 160 kata
  const [expanded, setExpanded] = useState(false); // Untuk melacak apakah sudah diperluas

  const kata = input
    .trim()
    .split(/\s+/)
    .filter((word) => word !== "").length;

  if (kata > maxKata) {
    const truncatedInput = input.split(/\s+/).slice(0, maxKata).join(" ") + " ";

    return (
      <div dangerouslySetInnerHTML={{ __html: truncatedInput }}>
        {!expanded ? (
          <span
            className="text-amber-700 cursor-pointer underline"
            onClick={() => {
              setMaxKata(maxInput);
              setExpanded(true);
            }}
          >
            ...Lihat Selengkapnya
          </span>
        ) : (
          <span
            className="text-amber-700 cursor-pointer underline"
            onClick={() => {
              setMaxKata(minInput);
              setExpanded(false);
            }}
          >
            ...Lihat Lebih Sedikit
          </span>
        )}
      </div>
    );
  }

  // Jika kata kurang dari atau sama dengan batas (160 atau 500), tampilkan teks penuh
  return <div dangerouslySetInnerHTML={{ __html: input }}></div>;
};

export default ViewMore;
