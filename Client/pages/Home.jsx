import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Product from "../components/product";
import SlideBar from "../components/slidebar";
import Footer from "../components/footer";
import TranslateAll from "../src/assets/translator.json";
import PopupNotification from "../src/notifications";
import { fetchData } from "../src/assets/api";
import NewSlidebar from "../components/newSlidebar";

const Home = ({
  navigate,
  advanceSettings,
  setDataNegara,
  negaraSelected,
  dataNegara,
  setNegaraSelected,
  socket,
}) => {
  const [messages, setMessages] = useState([]);
  const [langCode, setLangCode] = useState("id");

  useEffect(() => {
    if (localStorage.length > 0 && localStorage.lang) {
      const lang = JSON.parse(localStorage.lang);
      setLangCode(lang.langCode);
    }
  }, []);

  useEffect(() => {
    const GetFake = fetchData("api/invoice/fake/invoice");
    const { header_notif, content_notif } = TranslateAll[langCode];

    const handleNewMessage = (data) => {
      const notificationContent = content_notif
        .replace("{produk}", data.nama_produk)
        .replace(
          "{nama}",
          `<span class="text-[${advanceSettings.avcance_settings.popupColor.userText}]">
            ${data.userId}
          </span>`
        );
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          header: header_notif,
          message: notificationContent,
        },
      ]);
    };

    socket.on("invoiceUpdated", handleNewMessage);
    socket.on("invoiceFake", handleNewMessage);

    return () => {
      socket.off("invoiceUpdated", handleNewMessage);
      socket.off("invoiceFake", handleNewMessage);
    };
  }, [langCode]);

  return (
    <div>
      <PopupNotification
        messages={messages}
        advanceSettings={advanceSettings.avcance_settings}
        setMessage={setMessages}
      />
      <Navbar advanceSettings={advanceSettings} />
      <div className="content">
        <NewSlidebar advanceSettings={advanceSettings} />
        <p
          className={`text-center text-2xl md:text-3xl mt-3 font-bold text-[${advanceSettings.avcance_settings.primaryColor.background}]`}
        >
          {advanceSettings.nama_company}
        </p>
        <div className="product-categori flex align-middle justify-center mt-3">
          <div
            style={{
              backgroundColor:
                advanceSettings.avcance_settings.primaryColor.background,
              color: advanceSettings.avcance_settings.primaryColor.text,
            }}
            className="text-center pt-1 pb-1 px-3 rounded-l-md"
          >
            {TranslateAll[langCode].content_1}
          </div>
          <select
            className="border-2 px-0 py-1 rounded-r-md categori cursor-pointer"
            style={{
              borderColor:
                advanceSettings.avcance_settings.primaryColor.background,
            }}
            onChange={(e) => {
              setNegaraSelected(e.target.value);
            }}
          >
            <option value="">
              <div className="running-text">
                {TranslateAll[langCode].content_2}
              </div>
            </option>
            {dataNegara?.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <Product
          navigate={navigate}
          AdvanceSettings={advanceSettings.avcance_settings}
          setDataNegara={setDataNegara}
          negaraSelected={negaraSelected}
        />
      </div>
      <Footer advanceSettings={advanceSettings} />
    </div>
  );
};

export default Home;
