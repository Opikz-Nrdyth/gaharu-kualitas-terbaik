import React, { useEffect, useState } from "react";
import "../src/assets/stylesheet/login.css"; // Import CSS kustom
import styled from "styled-components";
import SwalFireContent from "../src/assets/SwalFire";

export default function LoginPage({ settingsData }) {
  const styledData = settingsData.avcance_settings;
  const Btn = styled.button`
    box-shadow: inset 0 0 0 0 ${styledData?.primaryColor?.background};

    &:hover {
      box-shadow: inset 250px 0 0 0 ${styledData?.primaryColor?.background};
    }
  `;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [motivasi, setMotivasi] = useState("");
  const [showMotivasi, setShowMotivasi] = useState(false);
  const [displayedIndices, setDisplayedIndices] = useState([]);

  const motivasiPenjualan = [
    "Bagaimana kabarmu hari ini? Siap untuk mencapai target? <br> <b>Stay Focused!</b>",
    "Setiap langkah kecil mendekatkanmu pada penjualan besar! <br> <b>No Pain No Gain</b>",
    "Jangan pernah menyerah, setiap tantangan adalah kesempatan! <br> <b>Keep Pushing!</b>",
    "Penjualan hari ini mungkin lebih baik dari yang kamu kira! <br> <b>Believe in Yourself!</b>",
    "Percaya diri adalah kunci untuk sukses di dunia penjualan! <br> <b>Confidence is Key!</b>",
    "Tetap fokus, setiap usaha pasti membuahkan hasil! <br> <b>Work Hard!</b>",
    "Sukses dimulai dari keyakinan akan kemampuan dirimu! <br> <b>Dream Big!</b>",
    "Hari ini adalah kesempatan baru untuk mencapai target baru! <br> <b>New Opportunities!</b>",
    "Setiap 'tidak' mendekatkanmu pada 'ya' yang luar biasa! <br> <b>Keep Trying!</b>",
    "Energi positifmu akan mempengaruhi hasil penjualan! <br> <b>Stay Positive!</b>",
    "Kamu sudah lebih dekat pada keberhasilan, teruskan semangatmu! <br> <b>Keep Going!</b>",
    "Jangan takut gagal, setiap kegagalan adalah pelajaran berharga! <br> <b>Learn and Grow!</b>",
    "Penjualan besar dimulai dari kepercayaan pada proses kecil! <br> <b>Small Steps!</b>",
    "Jaga motivasi, hasil besar butuh dedikasi! <br> <b>Stay Dedicated!</b>",
    "Pelanggan menghargai ketulusan, jual dengan hati! <br> <b>Be Genuine!</b>",
    "Setiap hari adalah peluang baru untuk berkembang! <br> <b>Embrace Change!</b>",
    "Tantangan hari ini adalah kemenangan besok! <br> <b>Victory Awaits!</b>",
    "Fokus pada solusi, bukan masalah! <br> <b>Find Solutions!</b>",
    "Selalu berpikir positif, hasil positif akan mengikuti! <br> <b>Think Positive!</b>",
    "Penjual sukses adalah yang selalu belajar dari setiap pengalaman! <br> <b>Keep Learning!</b>",
  ];

  function acakMotivasi() {
    // Cek apakah semua motivasi sudah ditampilkan
    if (displayedIndices.length === motivasiPenjualan.length) {
      // Reset tampilan
      setDisplayedIndices([]);
    }

    // Ambil indeks acak yang belum ditampilkan
    let indeksAcak;
    do {
      indeksAcak = Math.floor(Math.random() * motivasiPenjualan.length);
    } while (displayedIndices.includes(indeksAcak));

    // Update state motivasi dan tambahkan indeks ke displayedIndices
    setMotivasi(motivasiPenjualan[indeksAcak]);
    setDisplayedIndices((prev) => [...prev, indeksAcak]);
    setShowMotivasi(false); // Mengatur transisi keluar

    const timeOut = setTimeout(() => {
      setShowMotivasi(true);
    }, 300);
    return () => clearTimeout(timeOut);
  }

  useEffect(() => {
    acakMotivasi();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      acakMotivasi();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      username ===
        (settingsData?.username_admin ||
          "i3i2j4i2ri3n94vimwi43jr0ipkfdqpk30") &&
      password ===
        (settingsData?.password_admin || "i3i2j4i2ri3n94vimwi43jr0ipkfdqpk30")
    ) {
      const loginTime = new Date().getTime();
      sessionStorage.setItem("user", JSON.stringify({ username }));
      sessionStorage.setItem("loginTime", loginTime);
      SwalFireContent(
        "success",
        "Berhasil Login!",
        "Login Berhasil",
        settingsData
      );

      window.location.href = "/admin";
    } else {
      SwalFireContent(
        "error",
        "Cek Kembali Username Atau Password Anda!",
        "Login Gagal",
        settingsData
      );
    }
  };

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("user");
    const loginTime = sessionStorage.getItem("loginTime");

    if (loggedInUser && loginTime) {
      const currentTime = new Date().getTime();
      const sessionDuration = 3 * 60 * 60 * 1000;

      if (currentTime - loginTime > sessionDuration) {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("loginTime");
      } else {
        window.location.href = "/admin";
      }
    }
  }, []);

  return (
    <div
      className={`wrapper bg-[${styledData?.backgroundcontent?.background}] min-h-screen flex items-center justify-center flex-col`}
    >
      <div className="container relative w-full md:max-w-[600px] flex bg-white shadow-md">
        <div
          className={`col-left md:w-3/5 p-8 flex bg-[${styledData?.primaryColor?.background}] clip-path-polygon`}
        >
          <div
            className={`login-text w-full text-[${styledData?.primaryColor?.text}]`}
          >
            <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
            <p
              className={`mb-5 text-base font-medium md:w-[70%] transition-opacity duration-300 ${
                showMotivasi ? "opacity-100" : "opacity-0"
              }`}
              dangerouslySetInnerHTML={{ __html: motivasi }}
            ></p>
          </div>
        </div>
        <form
          onSubmit={handleLogin}
          className="col-right md:w-1/2 p-16 md:-ml-[10%]"
        >
          <div className="login-form w-full">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <p className="mb-3 text-left text-gray-600 text-sm">Username*</p>
            <input
              type="text"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className={`w-full h-9 px-3 mb-4 border border-gray-300 rounded-full focus:outline-none focus:border-[${styledData?.inputColor?.text}]`}
            />
            <p className="mb-3 text-left text-gray-600 text-sm">Password*</p>
            <input
              type={showPassword ? "text" : "password"}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className={`w-full h-9 px-3 mb-4 border border-gray-300 rounded-full focus:outline-none focus:border-[${styledData?.inputColor?.text}]`}
            />

            <label class="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                onChange={() => {
                  setShowPassword(!showPassword);
                }}
                class="sr-only peer"
              />
              <div
                class={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-[]  rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-[${styledData.primaryColor.background}]`}
              ></div>
              <span class="ms-3 text-sm font-medium text-gray-900 ">
                Lihat Password
              </span>
            </label>

            <Btn
              type="submit"
              className={`btnLogin w-full mt-2 py-2 text-base text-[${styledData?.primaryColor?.background}] border border-[${styledData?.primaryColor?.background}] rounded-full transition-all duration-300 hover:bg-[${styledData?.primaryColor?.background}] hover:text-white`}
            >
              Login
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
}
