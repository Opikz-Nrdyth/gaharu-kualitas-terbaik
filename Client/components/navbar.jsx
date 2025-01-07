import { useEffect, useState } from "react";
import styled from "styled-components";
import Country from "../src/assets/country.json";
import TranslateAll from "../src/assets/translator.json";
import { useNavigate } from "react-router-dom";

const Navbar = ({ advanceSettings }) => {
  const [showDropdown, setShowDropdown] = useState(true);
  const NavContainer = styled.div`
    cursor: pointer;
    z-index: 50;
    background-color: ${advanceSettings.avcance_settings.header.background};
    color: ${advanceSettings.avcance_settings.header.text};
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 8px;
    position: fixed;
    top: 0px;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-image: url(${advanceSettings.avcance_settings.header
        .backgroundImages});
      background-size: cover;
      background-repeat: no-repeat;
      opacity: 0.5;
      z-index: 1;
    }

    & > * {
      position: relative;
      z-index: 2;
    }
  `;
  const navigate = useNavigate();

  const [langCode, setLangCode] = useState("id");
  const [lang, setLang] = useState();
  const [flag, setFlag] = useState("ID");

  const handleLang = (langObject) => {
    setLang(langObject);
    localStorage.setItem("lang", JSON.stringify(langObject));
    window.location.reload();
  };

  useEffect(() => {
    const storedLang = localStorage.getItem("lang");
    if (storedLang) {
      try {
        const parsedLang = JSON.parse(storedLang);
        setLang(parsedLang);
      } catch (error) {
        console.error("Error parsing stored language:", error);
        localStorage.removeItem("lang");
      }
    }
    if (localStorage.length > 0 && localStorage.lang) {
      const lang = JSON.parse(localStorage.lang);
      setLangCode(lang.langCode);
      setFlag(lang.flag);
    }
  }, []);

  return (
    <NavContainer className="px-3">
      <div className="flex items-center">
        <div
          className="ml-3"
          onClick={() => {
            navigate("/");
          }}
        >
          <img
            src={advanceSettings.foto_company[0] || "/Images/company-logo.png"}
            alt="Gaharu Kualitas Terbaik"
            className="rounded-full w-[40px] md:w-[50px]"
          />
        </div>
        <div>
          <p
            className="text-xl md:text-3xl font-bold ml-3"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            {advanceSettings.nama_pemilik}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <div classname="relative inline-block text-left h-fit">
          <div>
            <button
              type="button"
              className="inline-flex text-black w-full justify-center gap-x-1.5 rounded-md bg-white  px-3 py-2 text-sm font-semibold shadow-sm"
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
              onClick={() => {
                setShowDropdown(!showDropdown);
              }}
            >
              <img
                src={`https://purecatamphetamine.github.io/country-flag-icons/1x1/${flag}.svg`}
                alt={`https://purecatamphetamine.github.io/country-flag-icons/1x1/${flag}.svg`}
                width="20px"
                height="20px"
                className="rounded-full"
              />{" "}
              {TranslateAll[langCode].header}
              <svg
                className="-mr-1 h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div
            className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-[${advanceSettings.avcance_settings.header.background}] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            hidden={showDropdown}
          >
            <ul
              role="none"
              className="py-1 h-[400px] overflow-y-scroll"
              id="scroll-language"
            >
              {Country.map((item, index) => (
                <li
                  href="#"
                  className={`flex gap-3 align-middle px-4 py-2 text-sm text-[${advanceSettings.avcance_settings.header.text}] hover:bg-[${advanceSettings.avcance_settings.primaryColor.background}] hover:text-[${advanceSettings.avcance_settings.primaryColor.text}]`}
                  role="menuitem"
                  id="menu-item-0"
                  onClick={() => {
                    handleLang(item);
                  }}
                  key={index}
                >
                  <img
                    src={`https://purecatamphetamine.github.io/country-flag-icons/1x1/${item.flag}.svg`}
                    alt={`flag ${item.country}`}
                    width="30px"
                    height="30px"
                    className="rounded-full"
                  />
                  {item.country}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </NavContainer>
  );
};
export default Navbar;
