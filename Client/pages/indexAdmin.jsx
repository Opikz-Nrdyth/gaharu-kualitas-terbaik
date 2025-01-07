import { Link, useParams } from "react-router-dom";
import HomeAdmin from "./HomeAdmin";
import InputProduct from "./inputProduct";
import Settings from "./settings";
import NotificationPage from "./notifikasi";
import NavbarAdmin from "../components/navbarAdmin";
import DataProduk from "./produk";
import { useEffect, useState } from "react";
import { fetchData } from "../src/assets/api";
import Invoice from "./invoice";

const IndexAdmin = ({ navigate, advanceSettings, updateSettings, socket }) => {
  const params = useParams();
  const path = params["*"];
  localStorage.removeItem("lang");

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("user");
    const loginTime = sessionStorage.getItem("loginTime");

    if (loggedInUser && loginTime) {
      const currentTime = new Date().getTime(); // Waktu saat ini dalam milidetik
      const sessionDuration = 3 * 60 * 60 * 1000; // Durasi sesi 3 jam dalam milidetik

      // Periksa apakah sesi sudah berakhir
      if (currentTime - loginTime > sessionDuration) {
        // Jika sesi sudah berakhir, hapus data dan arahkan ke login
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("loginTime");
        window.location.href = "/login"; // ganti dengan route yang sesuai
      }
    } else {
      window.location.href = "/login"; // Jika tidak ada session, arahkan ke login
    }
  }, []);
  const [countInvoice, setCountInvoice] = useState(0);
  const GetInvoice = async () => {
    const result = await fetchData("api/invoice/status/pending");
    setCountInvoice(result.data.length);
  };

  useEffect(() => {
    GetInvoice();
    socket.on("newInvoice", (data) => {
      GetInvoice();
    });
    socket.on("deleteInvoices", (data) => {
      GetInvoice();
    });
    socket.on("invoiceUpdated", (data) => {
      GetInvoice();
    });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-amber-50">
      <NavbarAdmin advanceSettings={advanceSettings} socket={socket} />
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 mb-20 md:mb-10 md:p-8">
        {path == "" ? (
          <HomeAdmin advanceSettings={advanceSettings.avcance_settings} />
        ) : path == "produk" ? (
          <DataProduk
            navigate={navigate}
            advanceSettings={advanceSettings.avcance_settings}
          />
        ) : path == "inputproduk" ? (
          <InputProduct advanceSettings={advanceSettings.avcance_settings} />
        ) : path == "settings" ? (
          <Settings
            advanceSettings={advanceSettings}
            updateSettings={updateSettings}
          />
        ) : path == "notifikasi" ? (
          <NotificationPage
            advanceSettings={advanceSettings.avcance_settings}
            socket={socket}
          />
        ) : path == "invoice" ? (
          <Invoice advanceSettings={advanceSettings.avcance_settings} />
        ) : (
          <HomeAdmin advanceSettings={advanceSettings.avcance_settings} />
        )}
      </div>

      {/* Bottom Navigation for Mobile and Tablet */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 p-4 slide-up"
        style={{
          backgroundColor: advanceSettings.avcance_settings.header.background,
        }}
      >
        <div className="flex justify-around">
          <Link
            to="/admin"
            className="flex flex-col items-center"
            style={{
              color: advanceSettings.avcance_settings.primaryColor.text,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color =
                advanceSettings.avcance_settings.secondaryColor.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                advanceSettings.avcance_settings.primaryColor.text;
            }}
          >
            <i className="fa-solid fa-house"></i>
            <span className="text-xs">Beranda</span>
          </Link>
          <Link
            to="/admin/produk"
            className="flex flex-col items-center"
            style={{
              color: advanceSettings.avcance_settings.primaryColor.text,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color =
                advanceSettings.avcance_settings.secondaryColor.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                advanceSettings.avcance_settings.primaryColor.text;
            }}
          >
            <i className="fa-solid fa-circle-plus"></i>
            <span className="text-xs">Produk</span>
          </Link>
          <Link
            to="/admin/notifikasi"
            className="flex flex-col items-center relative"
            style={{
              color: advanceSettings.avcance_settings.primaryColor.text,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color =
                advanceSettings.avcance_settings.secondaryColor.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                advanceSettings.avcance_settings.primaryColor.text;
            }}
          >
            <div className="relative">
              <i className="fa-solid fa-bell"></i>
              {countInvoice != 0 ? (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {countInvoice}
                </span>
              ) : null}
            </div>
            <span className="text-xs">Notifikasi</span>
          </Link>
          <Link
            to="/admin/settings"
            className="flex flex-col"
            style={{
              color: advanceSettings.avcance_settings.primaryColor.text,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color =
                advanceSettings.avcance_settings.secondaryColor.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                advanceSettings.avcance_settings.primaryColor.text;
            }}
          >
            <i className="fa-solid fa-gears"></i>
            <span className="text-xs">Pengaturan</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};
export default IndexAdmin;
