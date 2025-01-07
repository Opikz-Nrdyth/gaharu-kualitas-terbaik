import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import DetailProduct from "../pages/detailProduk";
import "../src/assets/stylesheet/global.css";
import AOS from "aos";
import "aos/dist/aos.css";
import HomeAdmin from "../pages/HomeAdmin";
import IndexAdmin from "../pages/indexAdmin";
import { fetchData } from "./assets/api";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "@sweetalert2/themes/material-ui";
import LoginPage from "../pages/login";
import defaultSettings from "./assets/defaultsettings.json";
import Loader from "../components/loading";
import io from "socket.io-client";

let storedId = localStorage.getItem("mySocketId");
if (!storedId) {
  storedId = "user_" + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("mySocketId", storedId);
}

const socketIo = io(import.meta.env.VITE_BASEURL, {
  query: { myID: storedId },
});

function App() {
  const [dataNegara, setDataNegara] = useState([]);
  const [negaraSelected, setNegaraSelected] = useState("");
  const [updateSetting, setUpdateSettings] = useState(0);

  const navigate = useNavigate();
  const [settingsData, setSettingsData] = useState(defaultSettings);
  const [loadSetting, setLoadSetting] = useState(true);

  AOS.init();

  const getDataSettings = async () => {
    const settings = await fetchData("api/settings");

    if (settings.status == "error" || settings.error) {
      setLoadSetting(false);
      Swal.fire({
        title: "Error",
        text: settings.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor:
          settingsData.avcance_settings.aksenButton.background,
        background: settingsData.avcance_settings.backgroundContent,
        color: settingsData.avcance_settings.Text?.primary,
      });
    } else {
      setLoadSetting(false);
      setSettingsData(settings.data);
    }
  };

  useEffect(() => {
    getDataSettings();
  }, [updateSetting]);

  document.body.style.backgroundColor =
    settingsData.avcance_settings.backgroundContent.background;

  useEffect(() => {
    // Mengganti title
    document.title = settingsData.nama_company;

    // Mengganti favicon
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.href = settingsData.foto_company;
    } else {
      const newFavicon = document.createElement("link");
      newFavicon.rel = "icon";
      newFavicon.type = "image/svg+xml";
      newFavicon.href = settingsData.foto_company;
      document.head.appendChild(newFavicon);
    }
  }, [settingsData]);
  if (window.location.pathname == "/login") {
    localStorage.removeItem("lang");
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          loadSetting ? (
            <Loader />
          ) : (
            <Home
              navigate={navigate}
              advanceSettings={settingsData}
              setDataNegara={setDataNegara}
              dataNegara={dataNegara}
              negaraSelected={negaraSelected}
              setNegaraSelected={setNegaraSelected}
              socket={socketIo}
            />
          )
        }
      />
      <Route
        path="/product/*"
        element={
          loadSetting ? (
            <Loader />
          ) : (
            <DetailProduct
              navigate={navigate}
              advanceSettings={settingsData}
              setDataNegara={setDataNegara}
              negaraSelected={negaraSelected}
              socket={socketIo}
            />
          )
        }
      />
      <Route
        path="/login"
        element={<LoginPage settingsData={settingsData} />}
      />
      <Route
        path="/admin/*"
        element={
          loadSetting ? (
            <Loader />
          ) : (
            <IndexAdmin
              navigate={navigate}
              advanceSettings={settingsData}
              updateSettings={setUpdateSettings}
              socket={socketIo}
            />
          )
        }
      />
    </Routes>
  );
}

export default App;
