import { Link } from "react-router-dom";
import { fetchData } from "../src/assets/api";
import { useEffect, useRef, useState } from "react";

const NavbarAdmin = ({ advanceSettings, socket }) => {
  const [countInvoice, setCountInvoice] = useState(0);
  const GetInvoice = async () => {
    const result = await fetchData("api/invoice/status/pending");
    setCountInvoice(result.data.length);
  };
  const audioRef = useRef(null);

  useEffect(() => {
    GetInvoice();
    socket.on("newInvoice", (data) => {
      GetInvoice();
      audioRef.current.play();
    });
    socket.on("deleteInvoices", (data) => {
      GetInvoice();
    });
    socket.on("invoiceUpdated", (data) => {
      GetInvoice();
    });
  }, []);

  return (
    <nav
      style={{
        backgroundColor: advanceSettings.avcance_settings.header.background,
        color: advanceSettings.avcance_settings.header.text,
      }}
      className="hidden md:flex h-[70px] justify-between items-center p-4"
    >
      <div className="flex items-center text-2xl font-bold">
        <img
          src={advanceSettings.foto_company[0] || "/Images/company-logo-bg.png"}
          alt="Gaharu Kualitas Terbaik"
          className="rounded-full w-[40px] md:w-[50px] mr-2"
        />
        {advanceSettings.nama_pemilik}
      </div>
      <audio ref={audioRef} src="/Sound/notif2.wav" />
      <div className="flex space-x-4">
        <Link
          to="/admin"
          style={{
            backgroundColor: "transparent", // Default tidak ada background
            color: "inherit", // Default tidak ada perubahan warna teks
          }}
          className="px-4 py-2 rounded transition duration-200"
          onMouseEnter={(e) => {
            e.target.style.backgroundColor =
              advanceSettings.avcance_settings.primaryButton.hover.background;
            e.target.style.color =
              advanceSettings.avcance_settings.primaryButton.hover.text;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "inherit";
          }}
        >
          Beranda
        </Link>
        <Link
          to="/admin/produk"
          style={{
            backgroundColor: "transparent",
            color: "inherit",
          }}
          className="px-4 py-2 rounded transition duration-200"
          onMouseEnter={(e) => {
            e.target.style.backgroundColor =
              advanceSettings.avcance_settings.primaryButton.hover.background;
            e.target.style.color =
              advanceSettings.avcance_settings.primaryButton.hover.text;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "inherit";
          }}
        >
          Produk
        </Link>
        <Link
          to="/admin/settings"
          style={{
            backgroundColor: "transparent",
            color: "inherit",
          }}
          className="px-4 py-2 rounded transition duration-200"
          onMouseEnter={(e) => {
            e.target.style.backgroundColor =
              advanceSettings.avcance_settings.primaryButton.hover.background;
            e.target.style.color =
              advanceSettings.avcance_settings.primaryButton.hover.text;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "inherit";
          }}
        >
          Pengaturan
        </Link>
        <Link
          to="/admin/notifikasi"
          style={{
            backgroundColor: "transparent",
            color: "inherit",
          }}
          className="px-4 py-2 rounded transition duration-200 relative"
          onMouseEnter={(e) => {
            e.target.style.backgroundColor =
              advanceSettings.avcance_settings.primaryButton.hover.background;
            e.target.style.color =
              advanceSettings.avcance_settings.primaryButton.hover.text;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "inherit";
          }}
        >
          <i className="fa-solid fa-bell"></i>
          {countInvoice != 0 ? (
            <span
              style={{
                backgroundColor: "red",
                color: "white",
              }}
              className="absolute top-0 -right-0 text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {countInvoice}
            </span>
          ) : null}
        </Link>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
