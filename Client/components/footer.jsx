import styled from "styled-components";
import TranslateAll from "../src/assets/translator.json";
import { useEffect, useState } from "react";

const Footer = ({ advanceSettings }) => {
  const styleData = advanceSettings.avcance_settings;
  const [langCode, setLangCode] = useState("id");
  function formatCopyright(text) {
    const currentYear = new Date().getFullYear();

    return `copyright © ${currentYear} - distributor by ${text}`;
  }
  useEffect(() => {
    if (localStorage.length > 0 && localStorage.lang) {
      const lang = JSON.parse(localStorage.lang);
      setLangCode(lang.langCode);
    }
  }, []);

  const WhatsAppButton = styled.a`
    position: fixed;
    transition: color 0.3s ease, margin-left 1s ease; /* Add transition for smoothness */

    &:hover::after {
      content: "${(props) => {
        return TranslateAll[props.langCode].chat_admin;
      }}";
      color: white;
      border-radius: 5px;
      white-space: nowrap;
      font-size: 1.25rem;
      margin-left: 5px;
      display: inline-block;
      vertical-align: middle;
    }
  `;

  return (
    <div
      style={{
        backgroundColor: styleData.header.background,
      }}
    >
      <WhatsAppButton
        langCode={langCode}
        href={`https://wa.me/${advanceSettings.nomer_whatsapp_bisnis}`}
        target="__blank"
        className="bottom-10 z-30 right-3 md:right-10 bg-green-500 px-3 py-2 text-3xl text-white rounded-full"
      >
        <i className="fa-brands fa-whatsapp"></i>
      </WhatsAppButton>
      <div className="p-3 flex justify-center gap-3 flex-wrap mb-5">
        <div className="w-[500px]" align="center">
          <p
            className="font-bold mb-3"
            style={{
              color: styleData.header.text,
            }}
          >
            {TranslateAll[langCode].payment}
          </p>
          <div className="flex flex-wrap justify-center w-[100%] gap-3 ">
            {advanceSettings?.intregrate_pembayaran?.map((item, index) => (
              <div className="images bg-white rounded-md" key={index}>
                <img src={item.logo} alt={item.nama} />
                <div
                  className="content-images"
                  style={{
                    backgroundColor: styleData.secondaryColor.background,
                    color: styleData.secondaryColor.text,
                  }}
                >
                  {item.nama}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[500px]" align="center">
          <p
            className="font-bold mb-3"
            style={{
              color: styleData.header.text,
            }}
          >
            {TranslateAll[langCode].ekspedisi}
          </p>
          <div className="flex flex-wrap justify-center w-[100%] gap-3">
            {advanceSettings?.intregrate_pengiriman?.map((item, index) => (
              <div className="images bg-white rounded-md" key={index}>
                <img src={item.logo} alt={item.nama} />
                <div
                  className="content-images"
                  style={{
                    backgroundColor: styleData.secondaryColor.background,
                    color: styleData.secondaryColor.text,
                  }}
                >
                  {item.nama}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between flex-wrap gap-5">
        <div className="px-5 w-[100%] md:w-fit">
          <p
            className="text-xl font-bold text-center md:text-start"
            style={{
              color: styleData.header.text,
            }}
          >
            {TranslateAll[langCode].sosmed}
          </p>
          <div className="flex gap-5 justify-center md:justify-start">
            {advanceSettings?.akun_sosmed_lainnya?.instagram.trim() != "" ? (
              <a
                href={advanceSettings.akun_sosmed_lainnya.instagram}
                className="text-xl font-bold hover:scale-[1.3]"
                style={{
                  color: styleData.header.text,
                }}
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
            ) : null}
            {advanceSettings?.akun_sosmed_lainnya?.facebook.trim() != "" ? (
              <a
                href={advanceSettings.akun_sosmed_lainnya.facebook}
                className="text-xl font-bold hover:scale-[1.3]"
                style={{
                  color: styleData.header.text,
                }}
              >
                <i className="fa-brands fa-square-facebook"></i>
              </a>
            ) : null}
            {advanceSettings?.akun_sosmed_lainnya?.twitter.trim() != "" ? (
              <a
                href={advanceSettings.akun_sosmed_lainnya.twitter}
                className="text-xl font-bold hover:scale-[1.3]"
                style={{
                  color: styleData.header.text,
                }}
              >
                <i className="fa-brands fa-twitter"></i>
              </a>
            ) : null}
          </div>
          {advanceSettings.link_grup.trim() &&
          advanceSettings.link_grup.trim() != "" ? (
            <div className="flex justify-center md:justify-start">
              <a
                href={advanceSettings.link_grup}
                className={`bg-[${advanceSettings?.avcance_settings?.primaryButton?.background}] text-[${advanceSettings?.avcance_settings?.primaryButton?.text}] px-2 py-1 rounded-md hover:bg-[${advanceSettings?.avcance_settings?.primaryButton?.hover?.background}] mt-3`}
              >
                {TranslateAll[langCode].join_group}
              </a>
            </div>
          ) : null}
        </div>
        <div className="px-5 flex flex-col items-center md:items-end w-[100%] md:w-fit">
          <p
            className="text-3xl font-bold text-center md:text-start"
            style={{
              color: styleData.header.text,
            }}
          >
            {advanceSettings.nama_company}
          </p>
          <p
            className="w-[350px] text-center md:text-end"
            style={{
              color: styleData.header.text,
            }}
          >
            {advanceSettings.alamat}
          </p>
        </div>
      </div>
      <a href="https://opikstudio.kesug.com/">
        <p
          className="text-center mt-5 pb-3"
          style={{
            color: styleData.header.text,
          }}
        >
          {formatCopyright(advanceSettings.nama_pemilik)}
        </p>
      </a>
    </div>
  );
};
export default Footer;
